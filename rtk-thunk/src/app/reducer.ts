import { usersReducer } from './../features/users/redux/usersSlice';
import { postSliceReducer } from '../features/posts/redux/postsSlice';

import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  posts: postSliceReducer,
  users: usersReducer,
});
