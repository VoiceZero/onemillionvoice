// api/messages.js
export default async function handler(req, res) {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uLdmDLDSAHhpxZ7XrwUgzi-pJsyW3f9ZMnoKMEMQrxs/gviz/tq?tqx=out:json';

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const messages = json.table.rows.map(row => {
      const rawDate = row.c[0]?.v;
      let formattedTimestamp = '';

      if (rawDate && typeof rawDate === 'string' && rawDate.startsWith('Date')) {
        const parts = rawDate.match(/\d+/g);
        if (parts && parts.length >= 3) {
          const jsDate = new Date(
            parseInt(parts[0]),                  // year
            parseInt(parts[1]),                  // month (0-based in JS)
            parseInt(parts[2]),                  // day
            parseInt(parts[3] || 0),             // hour
            parseInt(parts[4] || 0),             // minute
            parseInt(parts[5] || 0)              // second
          );

          formattedTimestamp = jsDate.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }
      }

      return {
        timestamp: formattedTimestamp,
        name: row.c[1]?.v || '',
        message: row.c[2]?.v || '',
        type: row.c[3]?.v || 'text'
      };
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Errore nel recupero dati:', error);
    res.status(500).json({ error: 'Errore durante il recupero dei messaggi.' });
  }
}

