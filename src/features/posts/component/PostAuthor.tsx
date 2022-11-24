import { useAppSelector } from '../../../hooks/redux-hooks';
import { selectAllUsers } from '../../users/redux/usersSlice';

export const PostAuthor = ({ userId }: { userId: string }) => {
  const users = useAppSelector(selectAllUsers);

  const author = users.find((user) => user.id === userId);

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
