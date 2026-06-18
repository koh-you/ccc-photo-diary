module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  sendJson(response, 200, {
    ok: true,
    app: "CCC",
    runtime: "vercel",
    model: process.env.OPENAI_MODEL || "gpt-5.5",
    hasServerApiKey: Boolean(process.env.OPENAI_API_KEY),
    hasSupabase: Boolean(
      (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      (process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    )
  });
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}
