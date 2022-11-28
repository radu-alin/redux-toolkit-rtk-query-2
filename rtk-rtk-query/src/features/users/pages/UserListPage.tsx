import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks/redux-hooks';

import { selectAllUsers } from '../redux/usersSlice';

export const UsersListPage = () => {
  const users = useAppSelector(selectAllUsers);

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};
