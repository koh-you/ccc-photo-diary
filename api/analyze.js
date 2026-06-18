const detailKeys = [
  "foodName",
  "placeName",
  "tasteNotes",
  "priceRange",
  "revisit",
  "wineName",
  "region",
  "grape",
  "vintage",
  "price",
  "pairing",
  "aiTastingNote",
  "myTastingNote",
  "rating",
  "workTitle",
  "creator",
  "venue",
  "genre",
  "backgroundNote",
  "impressivePart",
  "purpose",
  "unit",
  "problemType",
  "difficulty",
  "solutionIdea",
  "mistakeReason",
  "teachingNote",
  "aiConversationSummary",
  "needSimilarProblems"
];

const DEFAULT_PROVIDER = "anthropic";
const AI_PROVIDERS = {
  anthropic: {
    label: "Claude API",
    keyPrefix: "sk-ant-",
    defaultModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    envKeyName: "ANTHROPIC_API_KEY"
  },
  openai: {
    label: "OpenAI API",
    keyPrefix: "sk-",
    defaultModel: process.env.OPENAI_MODEL || "gpt-5.5",
    envKeyName: "OPENAI_API_KEY"
  }
};

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const body = readBody(request);
    const provider = normalizeProvider(body.provider);
    const providerConfig = getProviderConfig(provider);
    const clientApiKey = body.apiKey;
    const apiKey = clientApiKey || getServerApiKey(provider);
    const model = body.model || providerConfig.defaultModel;

    if (!apiKey) {
      sendJson(response, 400, {
        error: `${providerConfig.envKeyName} is not set on the server. Set it in Vercel Environment Variables.`
      });
      return;
    }

    if (!apiKey.startsWith(providerConfig.keyPrefix)) {
      sendJson(response, 400, {
        error: `${providerConfig.label} key must be the full key that starts with ${providerConfig.keyPrefix}.`
      });
      return;
    }

    if (!clientApiKey) {
      const authResult = await verifySupabaseUser(request);
      if (!authResult.ok) {
        sendJson(response, authResult.statusCode, { error: authResult.error });
        return;
      }
    }

    const imageDataUrls = Array.isArray(body.imageDataUrls) && body.imageDataUrls.length
      ? body.imageDataUrls
      : body.imageDataUrl
        ? [body.imageDataUrl]
        : [];

    const analysis = provider === "openai"
      ? await runOpenAiAnalysis({ apiKey, model, body, imageDataUrls })
      : await runAnthropicAnalysis({ apiKey, model, body, imageDataUrls });
    if (!analysis.ok) {
      sendJson(response, analysis.status, {
        error: analysis.error,
        details: analysis.details
      });
      return;
    }

    let result;
    try {
      result = JSON.parse(analysis.text);
    } catch (error) {
      sendJson(response, 502, {
        error: "AI response was not valid JSON.",
        raw: analysis.text
      });
      return;
    }

    sendJson(response, 200, {
      provider,
      model: analysis.model || model,
      result
    });
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: error.message || "Server error" });
  }
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function readBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");
  return request.body;
}

function normalizeProvider(provider) {
  return Object.prototype.hasOwnProperty.call(AI_PROVIDERS, provider) ? provider : DEFAULT_PROVIDER;
}

function getProviderConfig(provider) {
  return AI_PROVIDERS[normalizeProvider(provider)];
}

function getServerApiKey(provider) {
  if (provider === "openai") return process.env.OPENAI_API_KEY || "";
  return process.env.ANTHROPIC_API_KEY || "";
}

async function runOpenAiAnalysis({ apiKey, model, body, imageDataUrls }) {
  const content = [{ type: "input_text", text: buildPrompt(body) }];
  imageDataUrls.slice(0, 4).forEach((imageDataUrl) => {
    content.push({ type: "input_image", image_url: imageDataUrl });
  });

  const apiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "user",
          content
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ccc_analysis",
          strict: true,
          schema: buildAnalysisSchema()
        }
      }
    })
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    return {
      ok: false,
      status: apiResponse.status,
      error: payload.error?.message || "OpenAI API request failed.",
      details: payload.error || payload
    };
  }

  return {
    ok: true,
    model: payload.model || model,
    text: extractOpenAiOutputText(payload)
  };
}

async function runAnthropicAnalysis({ apiKey, model, body, imageDataUrls }) {
  const content = [{ type: "text", text: buildPrompt(body) }];
  imageDataUrls.slice(0, 4).forEach((imageDataUrl) => {
    const imageSource = parseImageDataUrl(imageDataUrl);
    if (!imageSource) return;
    content.push({
      type: "image",
      source: imageSource
    });
  });

  const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      messages: [
        {
          role: "user",
          content
        }
      ],
      output_config: {
        format: {
          type: "json_schema",
          schema: buildAnalysisSchema()
        }
      }
    })
  });

  const payload = await apiResponse.json();
  if (!apiResponse.ok) {
    return {
      ok: false,
      status: apiResponse.status,
      error: payload.error?.message || "Anthropic API request failed.",
      details: payload.error || payload
    };
  }

  return {
    ok: true,
    model: payload.model || model,
    text: extractAnthropicOutputText(payload)
  };
}

function parseImageDataUrl(dataUrl) {
  const match = String(dataUrl || "").match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;

  const mediaType = normalizeClaudeImageMediaType(match[1]);
  if (!mediaType) return null;

  return {
    type: "base64",
    media_type: mediaType,
    data: match[2]
  };
}

function normalizeClaudeImageMediaType(mediaType) {
  const normalized = String(mediaType || "").toLowerCase();
  if (normalized === "image/jpg") return "image/jpeg";
  if (["image/jpeg", "image/png", "image/gif", "image/webp"].includes(normalized)) return normalized;
  return "image/jpeg";
}

async function verifySupabaseUser(request) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) return { ok: true };

  const authorization = request.headers.authorization || request.headers.Authorization || "";
  const match = String(authorization).match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      ok: false,
      statusCode: 401,
      error: "로그인 세션이 필요합니다. 서버 OpenAI 키를 사용하려면 먼저 CCC 클라우드에 로그인해주세요."
    };
  }

  const userResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${match[1]}`
    }
  });

  if (!userResponse.ok) {
    return {
      ok: false,
      statusCode: 401,
      error: "로그인 세션을 확인하지 못했습니다. 다시 로그인한 뒤 AI 호출을 시도해주세요."
    };
  }

  return { ok: true };
}

function buildPrompt(body) {
  const category = body.categoryLabel || body.category || "기록";
  const currentDraft = JSON.stringify(body.currentDraft || {}, null, 2);

  return [
    "너는 CCC 사진 아카이브 앱의 기록 정리 도우미다.",
    "사진과 사용자의 요청을 바탕으로 정보 초안을 만든다.",
    "모르는 내용은 추측하지 말고 빈 문자열로 둔다.",
    "사용자의 실제 감상은 대신 확정하지 말고, reflection에는 사용자가 고치기 쉬운 질문형 초안만 둔다.",
    "와인 라벨은 읽을 수 있는 정보만 추출하고, tasting note는 일반적인 참고 초안으로 작성한다.",
    "수학문제는 단원, 문제 유형, 풀이 아이디어, 막히는 지점, 설명 보완 포인트를 정리한다.",
    "문화예술/건축은 사진에서 확인 가능한 단서와 사용자가 준 문맥만 바탕으로 배경정보 초안을 만든다.",
    "",
    `카테고리: ${category}`,
    `사용자 요청: ${body.prompt || ""}`,
    "현재 입력값:",
    currentDraft,
    "",
    "반드시 주어진 JSON schema에 맞춰 한국어로 응답한다."
  ].join("\n");
}

function buildAnalysisSchema() {
  const categoryDetailProperties = {};
  detailKeys.forEach((key) => {
    categoryDetailProperties[key] = key === "needSimilarProblems" ? { type: "boolean" } : { type: "string" };
  });

  return {
    type: "object",
    additionalProperties: false,
    required: ["title", "quickComment", "detailedComment", "reflection", "tags", "categoryDetails", "aiNote"],
    properties: {
      title: { type: "string" },
      quickComment: { type: "string" },
      detailedComment: { type: "string" },
      reflection: { type: "string" },
      tags: {
        type: "array",
        items: { type: "string" }
      },
      categoryDetails: {
        type: "object",
        additionalProperties: false,
        required: detailKeys,
        properties: categoryDetailProperties
      },
      aiNote: { type: "string" }
    }
  };
}

function extractOpenAiOutputText(payload) {
  if (payload.output_text) return payload.output_text;

  const message = payload.output?.find((item) => item.type === "message");
  const output = message?.content?.find((item) => item.type === "output_text");
  return output?.text || "";
}

function extractAnthropicOutputText(payload) {
  const textBlock = payload.content?.find((item) => item.type === "text");
  return textBlock?.text || "";
}
