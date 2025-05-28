export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const { name, message, messageType } = req.body;

  try {
    const response = await fetch(process.env.SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        message,
        messageType,
      }),
    });

    const result = await response.text();
    return res.status(200).send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Failed to forward to Google Sheet');
  }
}
