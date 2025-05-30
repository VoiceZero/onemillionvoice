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

      if (typeof rawTimestamp === 'string') {
        // Assume che sia già formattato, usalo direttamente
        timestamp = rawTimestamp;
      } else if (typeof rawTimestamp === 'object' && rawTimestamp instanceof Date) {
        timestamp = rawTimestamp.toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        }) + ' ' + rawTimestamp.toLocaleTimeString("it-IT", {
          hour: "2-digit",
          minute: "2-digit"
        });
      } else {
        timestamp = "Data non valida";
      }

      return { timestamp, name, message, type, timezone };
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore nel recupero dati:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei messaggi.' });
  }
}
