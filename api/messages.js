// api/messages.js
export default async function handler(req, res) {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uLdmDLDSAHhpxZ7XrwUgzi-pJsyW3f9ZMnoKMEMQrxs/gviz/tq?tqx=out:json';

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const messages = json.table.rows.map(row => {
      const rawTimestamp = row.c[0]?.v || '';
      const name = row.c[1]?.v || '';
      const message = row.c[2]?.v || '';
      const type = row.c[3]?.v || 'text';
      const timezone = row.c[4]?.v || '';

      let timestamp = '';
      let dateObj = null;

      // Prova ISO 8601
      if (typeof rawTimestamp === 'string' && !isNaN(Date.parse(rawTimestamp))) {
        dateObj = new Date(rawTimestamp);
      }

      // Prova formato Date(2025,4,29,16,5,11)
      if (typeof rawTimestamp === 'string' && rawTimestamp.startsWith("Date(")) {
        try {
          const parts = rawTimestamp
            .replace("Date(", "")
            .replace(")", "")
            .split(",")
            .map(n => parseInt(n));
          dateObj = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
        } catch (err) {
          console.warn("Errore parsing Date():", rawTimestamp);
        }
      }

      if (dateObj && !isNaN(dateObj)) {
        timestamp =
          dateObj.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          }) +
          " " +
          dateObj.toLocaleTimeString("it-IT", {
            hour: "2-digit",
            minute: "2-digit"
          });
      }

      return { timestamp, name, message, type, timezone };
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore nel recupero dati:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei messaggi.' });
  }
}
