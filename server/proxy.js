import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const AI_SERVICE = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.post('/api/transcribe', async (req, res) => {
  try {
    const r = await fetch(`${AI_SERVICE}/transcribe/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    const r = await fetch(`${AI_SERVICE}/summarize/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/qa/generate', async (req, res) => {
  try {
    const r = await fetch(`${AI_SERVICE}/qa/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const r = await fetch(`${AI_SERVICE}/tts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const json = await r.json();
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Proxy listening on ${PORT}, forwarding to ${AI_SERVICE}`));
