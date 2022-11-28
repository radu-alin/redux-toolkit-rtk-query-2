import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectUserById } from '../redux/usersSlice';
import { selectPostsByUser } from '../../posts/redux/postsSlice';

export const UserPage = () => {
  const { userId } = useParams();

  const user = useAppSelector((state) => selectUserById(state, Number(userId)));
  const postsForUser = useAppSelector((state) =>
    selectPostsByUser(state, Number(userId))
  );

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{postTitles}</ol>
    </section>
  );
};
