import { Configuration, OpenAIApi } from 'openai';
import { Lead } from '../models/lead';

const apiKey = process.env.OPENAI_API_KEY;

const openai = apiKey
  ? new OpenAIApi(new Configuration({ apiKey }))
  : undefined;

export async function generateMessage(lead: Lead): Promise<string> {
  if (!openai) return 'No OpenAI API key configured.';
  const { data } = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful outreach assistant.' },
      {
        role: 'user',
        content: `Write a short outreach message to ${lead.username} about automation services.`
      }
    ]
  });
  return data.choices[0]?.message?.content?.trim() || '';
}
