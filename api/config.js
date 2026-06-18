module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  sendJson(response, 200, {
    app: "CCC",
    hasSupabase: Boolean(supabaseUrl && supabaseAnonKey),
    supabaseUrl,
    supabaseAnonKey,
    hasServerApiKey: Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY),
    provider: "anthropic",
    model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
    providers: {
      anthropic: {
        label: "Claude API",
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",
        hasServerApiKey: Boolean(process.env.ANTHROPIC_API_KEY)
      },
      openai: {
        label: "OpenAI API",
        model: process.env.OPENAI_MODEL || "gpt-5.5",
        hasServerApiKey: Boolean(process.env.OPENAI_API_KEY)
      }
    }
  });
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}
