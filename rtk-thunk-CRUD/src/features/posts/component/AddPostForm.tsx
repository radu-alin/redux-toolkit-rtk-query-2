import { useState, ChangeEvent } from 'react';

import { useAppSelector, useAppDispatch } from '../../../hooks/redux-hooks';

import { addNewPost_API } from '../redux/postsCreateAction';
import { selectAllUsers } from '../../users/redux/usersSlice';

import { STATUS, STATUS_OPTIONS } from '../../../types';

export const AddPostForm = () => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState<number>(0);
  const [addRequestStatus, setAddRequestStatus] = useState<STATUS_OPTIONS>(STATUS.IDLE);

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(Number(e.target.value));

  const isValidForm =
    [userId, title, body].every(Boolean) && addRequestStatus === STATUS.IDLE;

  const onSavePostClicked = () => {
    if (!isValidForm) {
      return;
    }
    try {
      setAddRequestStatus(STATUS.PENDING);
      userId && dispatch(addNewPost_API({ title, body, userId })).unwrap();

      setTitle('');
      setBody('');
      setUserId(0);
    } catch (err) {
      console.error('Failed to save the post', err);
    } finally {
      setAddRequestStatus(STATUS.IDLE);
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={body}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!isValidForm}>
          Save Post
        </button>
      </form>
    </section>
  );
};
