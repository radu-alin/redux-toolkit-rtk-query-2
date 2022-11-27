import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { store } from './app/store';

import { fetchUsers_API } from './features/users/redux/usersSlice';
import { fetchPosts_API } from './features/posts/redux/postsActionCreators';

import { App } from './App';

import './index.css';

store.dispatch(fetchPosts_API());
store.dispatch(fetchUsers_API());

const routes = (
  <Router>
    <Routes>
      <Route path="/*" element={<App />} />
    </Routes>
  </Router>
);

const app = <Provider store={store}>{routes}</Provider>;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(app);
