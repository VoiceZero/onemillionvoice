export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const result = await response.text();
    return res.status(200).send(result);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
