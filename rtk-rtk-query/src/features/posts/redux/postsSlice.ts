import {
  createSelector,
  createEntityAdapter,
  Dictionary,
  EntityId,
} from '@reduxjs/toolkit';
import { sub } from 'date-fns';

import { apiSlice } from '../../api/apiSlice';

import { Post, Post_API } from '../types';
import { RootState } from '../../../app/store';

import { defaultReactions } from './postsDataMock';
interface PostsState {
  ids: EntityId[];
  entities: Dictionary<Post>;
}

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState: PostsState = postsAdapter.getInitialState();

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // endpoint_getPosts
    getPosts: builder.query<PostsState, void>({
      query: () => ({ url: '/posts' }),
      transformResponse: (responseData: Post_API[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post: Partial<Post>) => {
          if (!post?.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post?.reactions) {
            post.reactions = {
              ...defaultReactions,
            };
          }
          return post as Post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) => {
        let postsArr: {
          type: 'Post';
          id: EntityId;
        }[];
        if (result) {
          postsArr = result.ids.map((id) => ({ type: 'Post', id }));
        } else {
          postsArr = [];
        }

        return [{ type: 'Post', id: 'LIST' }, ...postsArr];
      },
    }),
    // endpoint_getPostsByUserId
    getPostsByUserId: builder.query<PostsState, string>({
      query: (id: string) => `/posts/?userId=${id}`,
      transformResponse: (responseData: Post_API[]) => {
        let min = 1;
        const loadedPosts = responseData.map((post: Partial<Post>) => {
          if (!post?.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post?.reactions) {
            post.reactions = {
              ...defaultReactions,
            };
          }
          return post as Post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result, error, arg) =>
        [...result!.ids.map((id) => ({ type: 'Post', id }))] as {
          type: 'Post';
          id: EntityId;
        }[],
    }),
    // endpoint_addNewPost
    addNewPost: builder.mutation({
      query: (initialPost) => ({
        url: '/posts',
        method: 'POST',
        body: {
          ...initialPost,
          userId: Number(initialPost.userId),
          date: new Date().toISOString(),
          reactions: {
            ...defaultReactions,
          },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    // enpoint_updatePost
    updatePost: builder.mutation({
      query: (initialPost) => ({
        url: `/posts/${initialPost.id}`,
        method: 'PUT',
        body: {
          ...initialPost,
          date: new Date().toISOString(),
        },
      }),
      // arg is the argument passed to the mutation, ini this case initial post
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    // endpoint_deletePost
    deletePost: builder.mutation({
      query: ({ id }) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }],
    }),
    // endpoint_addReaction
    addReaction: builder.mutation({
      query: ({ postId, reactions }) => ({
        url: `posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      async onQueryStarted({ postId, reactions }, { dispatch, queryFulfilled }) {
        // `updateQueryData` requires the endpoint name and cache key arguments,
        // so it knows which piece of cache state to update
        const patchResult = dispatch(
          postsApiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
            const post = draft.entities[postId];
            console.log('%c-> developmentConsole: post= ', 'color:#77dcfd', post);
            if (post) {
              post.reactions = reactions;
              postsAdapter.upsertOne(draft, post);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

// RTK Query generates custom hooks
export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionMutation,
} = postsApiSlice;

// returns the query result object, BUT is not only the data
export const selectPostsResult = postsApiSlice.endpoints.getPosts.select();

// Creates memoized selector
const selectPostsData = createSelector(
  selectPostsResult,
  (postsResult) => postsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState
);
