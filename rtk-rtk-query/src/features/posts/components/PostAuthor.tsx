import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/redux-hooks';
import { selectAllUsers } from '../../users/redux/usersSlice';

export const PostAuthor = ({ userId }: { userId: number }) => {
  const users = useAppSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return (
    <span>
      by {author ? <Link to={`/users/${userId}`}>{author.name}</Link> : 'Unknown author'}
    </span>
  );
};
