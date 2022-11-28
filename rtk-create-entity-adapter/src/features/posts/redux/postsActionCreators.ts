import { NewPost } from '../types/index';
import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { Post, Post_API } from '../types';

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

export const updatePost_API = createAsyncThunk(
  'posts/updatePost',
  async (initialPost: Post) => {
    const { id } = initialPost;
    try {
      const response = await axios.put(`${POSTS_URL}/${id}`, initialPost);
      return response.data;
    } catch (err) {
      //return err.message;
      return initialPost; // only for testing Redux!
    }
  }
);

export const deletePost_API = createAsyncThunk(
  'posts/deletePost',
  async (initialPost: Post) => {
    const { id } = initialPost;
    try {
      const response = await axios.delete(`${POSTS_URL}/${id}`);
      if (response?.status === 200) return initialPost;
      return `${response?.status}: ${response?.statusText}`;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      } else {
        return 'Somethig went wront.';
      }
    }
  }
);
