export type Reactions_Options = 'thumbsUp' | 'wow' | 'heart' | 'rocket' | 'coffee';

export interface Reactions {
  thumbsUp: number;
  wow: number;
  heart: number;
  rocket: number;
  coffee: number;
}

export interface NewReaction {
  postId: string;
  reaction: Reactions_Options;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  reactions: Reactions;
}

export interface NewPost {
  userId: string;
  title: string;
  content: string;
}
