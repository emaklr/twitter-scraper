import OpenAI from 'openai'
import { Lead } from '../models/lead'

// Load API key from env
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function generateMessage(lead: Lead): Promise<string> {
  if (!openai) return 'No OpenAI API key configured.'

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful outreach assistant.' },
      {
        role: 'user',
        content: `Write a short outreach message to ${lead.username} about automation services for solo creators. Keep it casual, helpful, and non-pushy.`
      }
    ],
  })

  return response.choices[0]?.message?.content?.trim() || ''
}
