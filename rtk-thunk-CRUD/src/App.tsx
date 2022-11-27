import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';

import { PostsListPage } from './features/posts/pages';
import { AddPostFormPage } from './features/posts/pages';
import { PostPage } from './features/posts/pages';
import { EditPostFormPage } from './features/posts/pages';
import { UsersListPage } from './features/users/pages';
import { UserPage } from './features/users/pages';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsListPage />} />

        <Route path="post">
          <Route index element={<AddPostFormPage />} />
          <Route path=":postId" element={<PostPage />} />
          <Route path="edit/:postId" element={<EditPostFormPage />} />
        </Route>

        <Route path="users">
          <Route index element={<UsersListPage />} />
          <Route path=":userId" element={<UserPage />} />
        </Route>

        {/* catch all unknown routes*/}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
