import { sub } from 'date-fns';
import { Reactions } from '../types/index';

export const defaultReactions: Reactions = {
  thumbsUp: 0,
  wow: 0,
  heart: 0,
  rocket: 0,
  coffee: 0,
};

export const postsDataMock = [
  {
    id: '1',
    userId: '0',
    title: 'Learning Redux Toolkit',
    content: "I've heard good things.",
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      ...defaultReactions,
    },
  },
  {
    id: '2',
    userId: '1',
    title: 'Slices...',
    content: 'The more I say slice, the more I want pizza.',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      ...defaultReactions,
    },
  },
];
