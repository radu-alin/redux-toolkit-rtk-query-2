import { useAddReactionMutation } from '../redux/postsSlice';
import { Post, Reactions_Options } from '../types';

const reactionEmoji = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};

export const ReactionButtons = ({ post }: { post: Post }) => {
  const [addReaction] = useAddReactionMutation();

  const reactionEmojiArray = Object.keys(reactionEmoji) as Reactions_Options[];

  const reactionButtons = reactionEmojiArray.map((item) => {
    return (
      <button
        key={item}
        type="button"
        className="reactionButton"
        onClick={() => {
          const newValue = post.reactions[item] + 1;
          addReaction({
            postId: post.id,
            reactions: { ...post.reactions, [item]: newValue },
          });
        }}
      >
        {reactionEmoji[item]} {post.reactions[item]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
