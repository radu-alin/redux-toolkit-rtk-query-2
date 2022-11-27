import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

import {
  fetchPosts_API,
  addNewPost_API,
  updatePost_API,
  deletePost_API,
} from './postsActionCreators';
import { getSortedPostsHelper } from './helpers';

import { RootState } from '../../../app/store';
import { Post, NewReaction, Post_API } from '../types';
import { STATUS, STATUS_OPTIONS } from '../../../types';

import { defaultReactions } from './postsDataMock';

interface PostsState {
  posts: Post[];
  status: STATUS_OPTIONS;
  error: null | string;
}

const initialState: PostsState = {
  posts: [],
  status: STATUS.IDLE,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // postAdded: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     state.posts.push(action.payload);
    //   },
    //   prepare: ({ userId, title, body }: NewPost) => {
    //     const newPost: Post = {
    //       id: Math.floor(Math.random() * 90 + 100),
    //       title: title,
    //       body: body,
    //       userId: userId,
    //       date: sub(new Date(), { minutes: 1 }).toISOString(),
    //       reactions: {
    //         ...defaultReactions,
    //       },
    //     };
    //     return {
    //       payload: newPost,
    //     };
    //   },
    // },
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
      // case_fetchPosts
      .addCase(fetchPosts_API.pending, (state, _) => {
        state.status = STATUS.LOADING;
      })
      .addCase(fetchPosts_API.fulfilled, (state, action) => {
        state.status = STATUS.SUCCEDED;
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          const computedPost: Post = {
            id: post.id,
            title: post.title,
            body: post.body,
            userId: post.userId,
            date: sub(new Date(), { minutes: min++ }).toISOString(),
            reactions: {
              ...defaultReactions,
            },
          };

          return computedPost;
        });

        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts_API.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.error.message as string;
      })
      // case_addNewPost
      .addCase(addNewPost_API.fulfilled, (state, action: PayloadAction<Post_API>) => {
        const sortedPosts = getSortedPostsHelper(state.posts);
        const newPost = {
          ...action.payload,
          id: sortedPosts[sortedPosts.length - 1].id + 1,
          date: new Date().toISOString(),
          reactions: {
            ...defaultReactions,
          },
        } as Post;

        state.posts.push(newPost);
      })
      // case_updatePost
      .addCase(updatePost_API.fulfilled, (state, action: PayloadAction<Post>) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        action.payload.date = new Date().toISOString();
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = [...posts, action.payload];
      })
      // case_deletePost
      .addCase(deletePost_API.fulfilled, (state, action: PayloadAction<any | Post>) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const posts = state.posts.filter((post) => post.id !== id);
        state.posts = posts;
      });
  },
});

// custom selectors
export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const selectPostById = (state: RootState, postId: number) =>
  state.posts.posts.find((post) => post.id === postId);

export const { reactionAdded } = postsSlice.actions;

export const postSliceReducer = postsSlice.reducer;
