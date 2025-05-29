// api/messages.js
export default async function handler(req, res) {
  const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1uLdmDLDSAHhpxZ7XrwUgzi-pJsyW3f9ZMnoKMEMQrxs/gviz/tq?tqx=out:json';

  try {
    const response = await fetch(SHEET_URL);
    const text = await response.text();
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const messages = json.table.rows.map(row => {
      const rawTimestamp = row.c[0]?.v || '';
      let formattedDate = '';

      if (rawTimestamp.startsWith('Date(')) {
        try {
          const parts = rawTimestamp
            .replace('Date(', '')
            .replace(')', '')
            .split(',')
            .map(n => parseInt(n));

          const dateObj = new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
          formattedDate = dateObj.toLocaleString('it-IT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } catch (err) {
          console.error('Errore nel parsing della data:', rawTimestamp);
        }
      }

      return {
        timestamp: formattedDate,
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
