import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';
import axios from 'axios';

import { RootState } from './../../../app/store';

import { defaultReactions } from './postsDataMock';
import { NewPost, Post, Post_API, NewReaction } from '../types';
import { STATUS, STATUS_OPTIONS } from '../../../types';

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';

interface PostsState {
  posts: Post[];
  status: STATUS_OPTIONS;
  error: null | string;
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const { data } = await axios.get(POSTS_URL);
  return data as Post_API[];
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
  const response = await axios.post(POSTS_URL, initialPost);
  return response.data;
});

const initialState: PostsState = {
  posts: [],
  status: STATUS.IDLE,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.posts.push(action.payload);
      },
      prepare: ({ userId, title, body }: NewPost) => {
        const newPost: Post = {
          id: Math.floor(Math.random() * 90 + 100),
          title: title,
          body: body,
          userId: userId,
          date: sub(new Date(), { minutes: 1 }).toISOString(),
          reactions: {
            ...defaultReactions,
          },
        };
        return {
          payload: newPost,
        };
      },
    },
    reactionAdded: (state, action: PayloadAction<NewReaction>) => {
      const { postId, reaction } = action.payload;
      const existingPost = state.posts.find((post) => post.id === postId) as Post;
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state, _) => {
        state.status = STATUS.LOADING;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEDED;
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          const newPost: Post = {
            id: post.id,
            title: post.title,
            body: post.body,
            userId: post.userId,
            date: sub(new Date(), { minutes: min++ }).toISOString(),
            reactions: {
              ...defaultReactions,
            },
          };

          return newPost;
        });

        // Add any fetched posts to the array
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.error.message as string;
      });
  },
});

// custom selectors
export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const { postAdded, reactionAdded } = postsSlice.actions;

export const postSliceReducer = postsSlice.reducer;
