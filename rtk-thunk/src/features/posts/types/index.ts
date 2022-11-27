export type Reactions_Options = 'thumbsUp' | 'wow' | 'heart' | 'rocket' | 'coffee';

export interface Reactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface NewReaction {
  postId: number;
  reaction: Reactions_Options;
}
export interface Post_API {
  id: number;
  userId: number;
  title: string;
  body: string;
  date?: string;
  reactions?: Reactions;
}
export interface Post extends Post_API {
  date: string;
  reactions: Reactions;
}

export interface NewPost {
  userId: number;
  title: string;
  body: string;
}
