export interface InstagramPost {
  id: string;
  media_url: string;
  caption: string;
  permalink: string;
  timestamp: string;
  like_count: bigint;
  comments_count: bigint;
  media_type: string;
}

export type InstagramPostResult = { ok: InstagramPost[] } | { err: string };
