import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectAllPosts, getPostsStatus, getPostsError } from '../redux/postsSlice';

import { PostItem } from './PostItem';

import { STATUS } from '../../../types';

export const PostsList = () => {
  const posts = useAppSelector(selectAllPosts);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  let content;
  if (postsStatus === STATUS.LOADING) {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === STATUS.SUCCEDED) {
    const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post) => <PostItem key={post.id} post={post} />);
  } else if (postsStatus === STATUS.FAILED) {
    content = <p>{postsError}</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
