import { config } from 'dotenv';
config();

import { searchRecentTweets, getLastTweetDate } from '../services/twitter';
import { isValidUser, buildLead } from '../utils/filter';
import { createLead } from '../services/airtable';

const KEYWORDS = [
  'Zapier',
  'Notion',
  'Beehiiv',
  'automate',
  'repurpose',
  'email system'
];

async function run() {
  for (const keyword of KEYWORDS) {
    const results = await searchRecentTweets(keyword);
    for (const { tweet, user } of results) {
      user.last_tweet_date = user.last_tweet_date || (await getLastTweetDate(user.username));
      if (isValidUser(user)) {
        const lead = buildLead(user, tweet, `keyword:${keyword}`);
        await createLead(lead);
        console.log('Saved lead', lead.username);
      }
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
