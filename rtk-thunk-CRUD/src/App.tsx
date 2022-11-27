import { AddPostForm } from './features/posts/component/AddPostForm';
import { PostsList } from './features/posts/component/PostsList';

export const App = () => {
  return (
    <main className="App">
      <AddPostForm />
      <PostsList />
    </main>
  );
};
