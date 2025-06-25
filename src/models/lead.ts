export interface Lead {
  id?: string;
  username: string;
  tweetText: string;
  triggerSource: string;
  followerCount: number;
  bio?: string;
  lastTweetDate: string;
  personaScore: number;
}
