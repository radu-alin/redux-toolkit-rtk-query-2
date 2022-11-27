import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

import { PostsList } from './features/posts/component/PostsList';
import { AddPostForm } from './features/posts/component/AddPostForm';
import { SinglePostPage } from './features/posts/component/PostPage';
import { EditPostForm } from './features/posts/component/EditPostForm';

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<PostsList />} />

        <Route path="post">
          <Route index element={<AddPostForm />} />
          <Route path=":postId" element={<SinglePostPage />} />
          <Route path="edit/:postId" element={<EditPostForm />} />
        </Route>
      </Route>
    </Routes>
  );
};
