import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { store } from './app/store';
import { fetchUsers } from './features/users/redux/usersSlice';

import { App } from './App';

import './index.css';

store.dispatch(fetchUsers());

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
