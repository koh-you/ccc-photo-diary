const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.argv[2] || process.env.PORT || 8080);
const host = "0.0.0.0";
const openaiModel = process.env.OPENAI_MODEL || "gpt-5.5";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

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

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/api/health") {
      sendJson(response, 200, {
        ok: true,
        app: "CCC",
        port,
        model: openaiModel,
        hasServerApiKey: Boolean(process.env.OPENAI_API_KEY),
        hasSupabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
      });
      return;
    }

    if (request.method === "GET" && request.url === "/api/config") {
      sendJson(response, 200, {
        app: "CCC",
        hasSupabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
        supabaseUrl: process.env.SUPABASE_URL || "",
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
        hasServerApiKey: Boolean(process.env.OPENAI_API_KEY),
        model: openaiModel
      });
      return;
    }

    if (request.method === "POST" && request.url === "/api/analyze") {
      await handleAnalyze(request, response);
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { error: "Method not allowed" });
      return;
    }

    serveStatic(request, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Server error" });
  }
});

server.listen(port, host, () => {
  console.log(`CCC server running at http://localhost:${port}`);
});

function serveStatic(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const decodedPath = decodeURIComponent(requestUrl.pathname);
  const safePath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    response.end(data);
  });
}

async function handleAnalyze(request, response) {
  const body = await readJsonBody(request);
  const apiKey = body.apiKey || process.env.OPENAI_API_KEY;
  const model = body.model || openaiModel;

  if (!apiKey) {
    sendJson(response, 400, {
      error: "OPENAI_API_KEY가 없고 앱에도 API 키가 입력되지 않았습니다."
    });
    return;
  }

  if (!apiKey.startsWith("sk-")) {
    sendJson(response, 400, {
      error: "API 키 형식이 맞지 않습니다. sk-로 시작하는 전체 OpenAI API 키를 입력하세요."
    });
    return;
  }

  const prompt = buildPrompt(body);
  const content = [{ type: "input_text", text: prompt }];
  const imageDataUrls = Array.isArray(body.imageDataUrls) && body.imageDataUrls.length ? body.imageDataUrls : body.imageDataUrl ? [body.imageDataUrl] : [];
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
    sendJson(response, apiResponse.status, {
      error: payload.error?.message || "OpenAI API 호출에 실패했습니다.",
      details: payload.error || payload
    });
    return;
  }

  const text = extractOutputText(payload);
  let result;
  try {
    result = JSON.parse(text);
  } catch (error) {
    sendJson(response, 502, {
      error: "AI 응답을 JSON으로 해석하지 못했습니다.",
      raw: text
    });
    return;
  }

  sendJson(response, 200, {
    model: payload.model || model,
    result
  });
}

function buildPrompt(body) {
  const category = body.categoryLabel || body.category || "기록";
  const currentDraft = JSON.stringify(body.currentDraft || {}, null, 2);
  return [
    "너는 CCC 사진 아카이브 앱의 기록 정리 도우미다.",
    "사진과 사용자의 요청을 바탕으로 정보 초안을 만들되, 모르는 것은 추측이라고 쓰거나 비워둔다.",
    "사용자의 실제 감상은 대신 단정하지 말고, reflection에는 사용자가 수정하기 쉬운 감상 질문 또는 매우 조심스러운 초안만 쓴다.",
    "와인 라벨은 읽을 수 있는 정보만 추출하고, 테이스팅 노트는 일반적인 후보로 작성한다.",
    "수학문제는 풀이 핵심, 막힌 지점, 설명 보완 포인트를 정리한다.",
    "문화예술/건축은 사진에서 확인 가능한 단서와 사용자가 준 문맥만 바탕으로 배경정보 초안을 쓴다.",
    "",
    `카테고리: ${category}`,
    `사용자 요청: ${body.prompt || ""}`,
    "현재 입력값:",
    currentDraft,
    "",
    "반드시 주어진 JSON 스키마에 맞춰 한국어로 답하라."
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

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 30 * 1024 * 1024) {
        request.destroy();
        reject(new Error("Request body is too large."));
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}
