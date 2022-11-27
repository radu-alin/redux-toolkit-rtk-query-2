import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from './../../../app/store';

import { User } from './../types/index';

const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const { data } = await axios.get(USERS_URL);
  return data as User[];
});

const initialState: User[] = [];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});

// custom selectors
export const selectAllUsers = (state: RootState) => state.users;

export const usersReducer = usersSlice.reducer;
