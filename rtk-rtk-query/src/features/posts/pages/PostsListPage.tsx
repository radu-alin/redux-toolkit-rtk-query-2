import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectPostIds, getPostsStatus, getPostsError } from '../redux/postsSlice';

import { PostItem } from '../components';

import { STATUS } from '../../../types';

export const PostsListPage = () => {
  const orderedPostsIds = useAppSelector(selectPostIds);
  const postsStatus = useAppSelector(getPostsStatus);
  const postsError = useAppSelector(getPostsError);

  let content;
  if (postsStatus === STATUS.LOADING) {
    content = <p>"Loading..."</p>;
  } else if (postsStatus === STATUS.SUCCEDED) {
    content = orderedPostsIds.map((postId) => <PostItem key={postId} postId={postId} />);
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
