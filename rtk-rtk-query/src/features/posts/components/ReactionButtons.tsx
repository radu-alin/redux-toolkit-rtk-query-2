import { useAppDispatch } from '../../../hooks/redux-hooks';
import { reactionAdded } from '../redux/postsSlice';
import { Post, Reactions_Options } from '../types';

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};

export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();

  const reactionEmojiArray = Object.keys(reactionEmoji) as Reactions_Options[];

  const reactionButtons = reactionEmojiArray.map((item) => {
    return (
      <button
        key={item}
        type="button"
        className="reactionButton"
        onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: item }))}
      >
        {reactionEmoji[item]} {post.reactions[item]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
