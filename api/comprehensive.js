export default async function handler(req, res) {
  const backendUrl = process.env.ROSC_BACKEND_URL;
  const apiKey = process.env.ROSC_API_KEY;

  if (!backendUrl || !apiKey) {
    return res.status(500).json({ error: "Backend configuration missing" });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const endpoint = req.query.endpoint;

  if (!["config", "hash", "comprehensive_v2"].includes(endpoint)) {
    return res.status(400).json({ error: "Invalid endpoint" });
  }

  try {
    const url = new URL(backendUrl);
    url.searchParams.set("endpoint", endpoint);
    url.searchParams.set("key", apiKey);

    const options = { method: req.method };

    if (req.method === "POST") {
      options.headers = {
        "Content-Type": "text/plain;charset=utf-8"
      };
      options.body = JSON.stringify(req.body || {});
    }

    const response = await fetch(url.toString(), options);
    const result = await response.json();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(502).json({
      error: "Backend connection failed"
    });
  }
}
