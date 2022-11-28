import { RootState } from './../../../app/store';
import {
  createSlice,
  createSelector,
  createEntityAdapter,
  PayloadAction,
  Dictionary,
  EntityId,
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';

import {
  fetchPosts_API,
  addNewPost_API,
  updatePost_API,
  deletePost_API,
} from './postsActionCreators';

import { Post, NewReaction, Post_API } from '../types';
import { STATUS, STATUS_OPTIONS } from '../../../types';

import { defaultReactions } from './postsDataMock';
interface PostsState {
  ids: EntityId[];
  entities: Dictionary<Post>;
  status: STATUS_OPTIONS;
  error: null | string;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: PostsState = postsAdapter.getInitialState({
  status: STATUS.IDLE,
  error: null,
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded: (state, action: PayloadAction<NewReaction>) => {
      postsAdapter.getInitialState();
      console.log(
        '%c-> developmentConsole: postsAdapter.getInitialState();= ',
        'color:#77dcfd',
        state
      );
      const { postId, reaction } = action.payload;
      const getPostId = String(postId);
      const existingPost = state.entities[getPostId] as Post;
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

        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts_API.rejected, (state, action) => {
        state.status = STATUS.FAILED;
        state.error = action.error.message as string;
      })
      // case_addNewPost
      .addCase(addNewPost_API.fulfilled, (state, action: PayloadAction<Post_API>) => {
        const newPostId = Number(state.ids[state.ids.length - 1]) + 1;
        const newPost = {
          ...action.payload,
          date: new Date().toISOString(),
          id: newPostId,
          reactions: {
            ...defaultReactions,
          },
        } as Post;

        console.log('%c-> developmentConsole: newPost= ', 'color:#77dcfd', newPost);
        postsAdapter.addOne(state, newPost);
      })
      // case_updatePost
      .addCase(updatePost_API.fulfilled, (state, action: PayloadAction<Post>) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        action.payload.date = new Date().toISOString();

        postsAdapter.upsertOne(state, action.payload);
      })
      // case_deletePost
      .addCase(deletePost_API.fulfilled, (state, action: PayloadAction<any | Post>) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }

        postsAdapter.removeOne(state, action.payload.id);
      });
  },
});

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state: RootState) => state.posts);

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state: RootState, userId: number) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { reactionAdded } = postsSlice.actions;

export const postSliceReducer = postsSlice.reducer;
