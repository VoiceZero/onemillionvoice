// api/messages.js
export default async function handler(req, res) {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uLdmDLDSAHhpxZ7XrwUgzi-pJsyW3f9ZMnoKMEMQrxs/gviz/tq?tqx=out:json';

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const messages = json.table.rows.map(row => {
      const rawDate = row.c[0]?.f || ''; // Usa il formato formattato (es: "29/05/2025, 11:44")
      const name = row.c[1]?.v || '';
      const message = row.c[2]?.v || '';
      const type = row.c[3]?.v || 'text';

      return {
        timestamp: rawDate,
        name,
        message,
        type
      };
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore nel recupero dati:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei messaggi.' });
  }
}
