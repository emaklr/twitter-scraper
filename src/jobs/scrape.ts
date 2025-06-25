import { config } from 'dotenv';
config();

import { searchRecentTweets, getLastTweetDate } from '../services/twitter';
import { isValidUser, scoreLead, draftMessage, buildLead } from '../utils/filter';
import { createLead } from '../services/airtable';
import { TwitterUser } from '../utils/filter';

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
      const fullUser: TwitterUser = {
        ...user,
        last_tweet_date: user.last_tweet_date || (await getLastTweetDate(user.username))
      };

      if (isValidUser(fullUser)) {
        const personaScore = scoreLead(fullUser, tweet);
        const message = await draftMessage(fullUser.username);
        const lead = buildLead(fullUser, tweet, `keyword:${keyword}`, personaScore, message);

        await createLead(lead);
        console.log('✅ Lead saved:', lead.username);
      }
    }
  }
}

// Wrap run() to avoid top-level await error
(async () => {
  try {
    await run();
  } catch (error) {
    console.error('❌ Scraper error:', error);
    process.exit(1);
  }
})();
