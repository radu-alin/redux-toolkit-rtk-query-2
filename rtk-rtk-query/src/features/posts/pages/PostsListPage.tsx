import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectPostIds } from '../redux/postsSlice';
import { useGetPostsQuery } from '../redux/postsSlice';

import { PostItem } from '../components';

export const PostsListPage = () => {
  const { isLoading, isSuccess, isError } = useGetPostsQuery();

  const orderedPostsIds = useAppSelector(selectPostIds);

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if (isSuccess) {
    content = orderedPostsIds.map((postId) => <PostItem key={postId} postId={postId} />);
  } else if (isError) {
    content = <p>'Something went wrong.'</p>;
  }

  return (
    <section>
      <h2>Posts</h2>
      {content}
    </section>
  );
};
