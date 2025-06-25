import { Lead } from '../models/lead';

export interface TwitterUser {
  username: string;
  followers_count: number;
  description?: string;
  url?: string;
  last_tweet_date?: string;
}

export function isValidUser(user: TwitterUser): boolean {
  const hasLink = !!user.url;
  const activeRecently = !!user.last_tweet_date &&
    Date.now() - new Date(user.last_tweet_date).getTime() <= 7 * 24 * 60 * 60 * 1000;
  return hasLink && activeRecently && user.followers_count > 100;
}

export function buildLead(user: TwitterUser, tweetText: string, triggerSource: string): Lead {
  return {
    username: user.username,
    tweetText,
    triggerSource,
    followerCount: user.followers_count,
    bio: user.description,
    lastTweetDate: user.last_tweet_date || '',
    personaScore: 1
  };
}
