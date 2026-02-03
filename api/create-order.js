// Serverless endpoint to create orders securely using Supabase service_role key
// Deploy on Vercel, Netlify (functions) or any serverless platform.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Supabase server configuration missing (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).' });
    return;
  }

  let payload = req.body;
  if (!payload || !payload.items) {
    res.status(400).json({ error: 'Invalid payload: items required' });
    return;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    const json = await response.json();

    if (!response.ok) {
      res.status(response.status).json({ error: json });
      return;
    }

    res.status(200).json({ data: json });
  } catch (err) {
    console.error('Server order insert error', err);
    res.status(500).json({ error: 'Server error inserting order' });
  }
}
