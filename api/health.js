module.exports = function handler(request, response) {
  if (request.method !== "GET") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  response.status(200).json({
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
