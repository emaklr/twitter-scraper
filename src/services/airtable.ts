import Airtable from 'airtable';
import { Lead } from '../models/lead';

const baseId = process.env.AIRTABLE_BASE_ID || '';
const apiKey = process.env.AIRTABLE_API_KEY || '';

const base = new Airtable({ apiKey }).base(baseId);

export async function createLead(lead: Lead): Promise<void> {
  await base('Leads').create({
  Username: lead.username,
  Tweet: lead.tweetText,
  Source: lead.triggerSource,
  Followers: lead.followerCount,
  Bio: lead.bio,
  LastTweet: lead.lastTweetDate,
  PersonaScore: lead.personaScore,
  Message: lead.message
});

}

export async function listLeads(): Promise<Lead[]> {
  const records = await base('Leads').select().all();
  return records.map((r) => ({
    id: r.id,
    username: r.get('Username') as string,
    tweetText: r.get('Tweet') as string,
    triggerSource: r.get('Source') as string,
    followerCount: r.get('Followers') as number,
    bio: r.get('Bio') as string,
    lastTweetDate: r.get('LastTweet') as string,
    personaScore: r.get('PersonaScore') as number
  }));
}
