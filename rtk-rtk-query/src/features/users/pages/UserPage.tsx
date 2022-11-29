import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectUserById } from '../redux/usersSlice';
import { useGetPostsByUserIdQuery } from '../../posts/redux/postsSlice';

export const UserPage = () => {
  const { userId } = useParams();

  const user = useAppSelector((state) => selectUserById(state, Number(userId)));
  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    isError,
  } = useGetPostsByUserIdQuery(userId as string);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;

    content = ids.map((id) => (
      <li key={id}>
        <Link to={`/post/${id}`}>{entities[id]?.title}</Link>
      </li>
    ));
  } else if (isError) {
    content = <p>'Something went wrong.'</p>;
  }

  return (
    <section>
      <h2>{user?.name}</h2>

      <ol>{content}</ol>
    </section>
  );
};
