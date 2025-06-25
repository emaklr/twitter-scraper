import OpenAI from 'openai';
import { Lead } from '../models/lead';

// -----------------------------
// Twitter User Type Definition
// -----------------------------
export interface TwitterUser {
  username: string;
  followers_count: number;
  description?: string;
  url?: string;
  last_tweet_date?: string;
}

// -----------------------------
// Lead Builder
// -----------------------------
export function buildLead(
  user: TwitterUser,
  tweetText: string,
  triggerSource: string,
  personaScore: number,
  message: string
): Lead {
  return {
    username: user.username,
    tweetText,
    triggerSource,
    followerCount: user.followers_count,
    bio: user.description,
    lastTweetDate: user.last_tweet_date || '',
    personaScore,
    message
  };
}

// -----------------------------
// Lead Validator
// -----------------------------
export function isValidUser(user: TwitterUser): boolean {
  const hasLink = !!user.url;
  const activeRecently = !!user.last_tweet_date &&
    Date.now() - new Date(user.last_tweet_date).getTime() <= 7 * 24 * 60 * 60 * 1000;
  return hasLink && activeRecently && user.followers_count > 100;
}

// -----------------------------
// Lead Scorer
// -----------------------------
export function scoreLead(user: TwitterUser, tweetText: string): number {
  let score = 1;
  const lowerText = tweetText.toLowerCase();

  if (lowerText.includes('automation')) score += 2;
  if (lowerText.includes('beehiiv')) score += 1;
  if (lowerText.includes('notion')) score += 1;
  if (lowerText.includes('email')) score += 1;
  if ((user.description || '').toLowerCase().includes('creator')) score += 1;

  return score;
}

// -----------------------------
// AI Message Drafting
// -----------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

export async function draftMessage(username: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful outreach assistant.' },
      {
        role: 'user',
        content: `Write a short DM introducing automation services to a solo creator named @${username}. Be helpful and friendly.`
      }
    ]
  });

  return response.choices[0]?.message?.content?.trim() || '';
}
