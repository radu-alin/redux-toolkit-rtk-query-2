import { Post } from '../types/index';

export const getSortedPostsHelper = (posts: Post[]) =>
  posts.sort((a, b) => {
    if (a.id > b.id) return 1;
    if (a.id < b.id) return -1;
    return 0;
  });
