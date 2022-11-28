import { Link } from 'react-router-dom';
import { EntityId } from '@reduxjs/toolkit';

import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';

import { Post } from '../types';
import { useAppSelector } from '../../../hooks/redux-hooks';
import { selectPostById } from '../redux/postsSlice';

export const PostItem = ({ postId }: { postId: EntityId }) => {
  const post = useAppSelector((state) => selectPostById(state, postId)) as Post;

  return (
    <article>
      <h2>{post.title}</h2>
      <p className="excerpt">{post.body.substring(0, 75)}...</p>
      <p className="postCredit">
        <Link to={`post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};
