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

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = readBody(request);
    const apiKey = body.apiKey || process.env.OPENAI_API_KEY;
    const model = body.model || process.env.OPENAI_MODEL || "gpt-5.5";

    if (!apiKey) {
      response.status(400).json({
        error: "OPENAI_API_KEY is not set on the server. Set it in Vercel Environment Variables."
      });
      return;
    }

    if (!apiKey.startsWith("sk-")) {
      response.status(400).json({
        error: "OpenAI API key must be the full key that starts with sk-."
      });
      return;
    }

    const content = [{ type: "input_text", text: buildPrompt(body) }];
    const imageDataUrls = Array.isArray(body.imageDataUrls) && body.imageDataUrls.length
      ? body.imageDataUrls
      : body.imageDataUrl
        ? [body.imageDataUrl]
        : [];

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
      response.status(apiResponse.status).json({
        error: payload.error?.message || "OpenAI API request failed.",
        details: payload.error || payload
      });
      return;
    }

    const text = extractOutputText(payload);
    let result;
    try {
      result = JSON.parse(text);
    } catch (error) {
      response.status(502).json({
        error: "AI response was not valid JSON.",
        raw: text
      });
      return;
    }

    response.status(200).json({
      model: payload.model || model,
      result
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: error.message || "Server error" });
  }
};

function readBody(request) {
  if (!request.body) return {};
  if (typeof request.body === "string") return JSON.parse(request.body || "{}");
  return request.body;
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

function extractOutputText(payload) {
  if (payload.output_text) return payload.output_text;

  const message = payload.output?.find((item) => item.type === "message");
  const output = message?.content?.find((item) => item.type === "output_text");
  return output?.text || "";
}
