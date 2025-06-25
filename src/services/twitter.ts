import axios from 'axios';
import { TwitterUser } from '../utils/filter';

const client = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
  }
});

export async function searchRecentTweets(query: string): Promise<{tweet: string, user: TwitterUser}[]> {
  const params = new URLSearchParams({
    query,
    'tweet.fields': 'author_id,created_at',
    'expansions': 'author_id',
    'user.fields': 'username,public_metrics,description,url',
    max_results: '10'
  });
  const { data } = await client.get(`/tweets/search/recent?${params.toString()}`);
  const users: Record<string, any> = {};
  if (data.includes && data.includes.users) {
    data.includes.users.forEach((u: any) => {
      users[u.id] = {
        username: u.username,
        followers_count: u.public_metrics.followers_count,
        description: u.description,
        url: u.url,
        last_tweet_date: undefined
      } as TwitterUser;
    });
  }
  return (data.data || []).map((t: any) => ({
    tweet: t.text,
    user: users[t.author_id]
  }));
}

export async function getLastTweetDate(username: string): Promise<string | undefined> {
  try {
    const { data } = await client.get(`/users/by/username/${username}`);
    const id = data.data.id;
    const timeline = await client.get(`/users/${id}/tweets`, {
      params: { max_results: 5 }
    });
    const tweets = timeline.data.data || [];
    return tweets.length ? tweets[0].created_at : undefined;
  } catch (err) {
    return undefined;
  }
}
