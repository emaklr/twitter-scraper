import { config } from 'dotenv';
config();

import express, { Request, Response } from 'express';
import { listLeads } from './services/airtable';
import { generateMessage } from './services/openai';

const app = express();
app.use(express.json());

app.get('/leads', async (_req: Request, res: Response) => {
  try {
    const leads = await listLeads();
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

app.post('/webhook/approval', async (req: Request, res: Response) => {
  const { id, username } = req.body;
  if (!id || !username) return res.status(400).json({ error: 'Missing id or username' });
  try {
    const message = await generateMessage({
      id,
      username,
      tweetText: '',
      triggerSource: 'approval',
      followerCount: 0,
      personaScore: 0,
      lastTweetDate: ''
    });
    res.json({ message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
