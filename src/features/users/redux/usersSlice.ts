import { createSlice } from '@reduxjs/toolkit';

import { RootState } from './../../../app/store';

import { User } from './../types/index';

const initialState: User[] = [
  { id: '0', name: 'Dude Lebowski' },
  { id: '1', name: 'Neil Young' },
  { id: '2', name: 'Dave Gray' },
];

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});

// custom selectors
export const selectAllUsers = (state: RootState) => state.users;

export const usersReducer = usersSlice.reducer;
