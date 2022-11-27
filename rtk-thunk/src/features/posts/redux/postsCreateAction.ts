import { NewPost } from './../types/index';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Post_API } from '../types';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

export const fetchPosts_API = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get(POSTS_URL);
  return data as Post_API[];
});

export const addNewPost_API = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost: NewPost) => {
    console.log('%c-> developmentConsole: initialPost= ', 'color:#77dcfd', initialPost);
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);
