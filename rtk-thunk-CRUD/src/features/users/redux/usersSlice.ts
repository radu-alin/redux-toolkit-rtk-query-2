import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../../../app/store';

import { User } from '../types/index';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers_API = createAsyncThunk('users/fetchUsers', async () => {
  const { data } = await axios.get(USERS_URL);
  return data as User[];
});

const initialState: User[] = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers_API.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

// custom selectors
export const selectAllUsers = (state: RootState) => state.users;
export const selectUserById = (state: RootState, userId: number) =>
  state.users.find((user) => user.id === userId);

export const usersReducer = usersSlice.reducer;
