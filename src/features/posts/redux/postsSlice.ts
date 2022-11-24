import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

import { RootState } from './../../../app/store';

import { NewPost, Post, NewReaction } from '../types';

import { postsDataMock, defaultReactions } from './postsDataMock';

const initialState: Post[] = [...postsDataMock];

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (state, action: PayloadAction<Post>) => {
        state.push(action.payload);
      },
      prepare: ({ userId, title, content }: NewPost) => {
        const newPost: Post = {
          id: nanoid(),
          title: title,
          content: content,
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
    reactionAdded(state, action: PayloadAction<NewReaction>) {
      const { postId, reaction } = action.payload;
      const existingPost = state.find((post) => post.id === postId) as Post;
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
  },
});

// custom selectors
export const selectAllPosts = (state: RootState) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export const postSliceReducer = postsSlice.reducer;
