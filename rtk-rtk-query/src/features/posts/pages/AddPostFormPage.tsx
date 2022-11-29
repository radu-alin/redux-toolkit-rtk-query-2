import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/redux-hooks';

import { useAddNewPostMutation } from '../redux/postsSlice';
import { selectAllUsers } from '../../users/redux/usersSlice';

export const AddPostFormPage = () => {
  const navigate = useNavigate();
  const [addNewPost, { isLoading }] = useAddNewPostMutation();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState<number>(0);

  const users = useAppSelector(selectAllUsers);

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(Number(e.target.value));

  const isValidForm = [userId, title, body].every(Boolean) && isLoading;

  const onSavePostClicked = async () => {
    if (!isValidForm) {
      return;
    }
    try {
      await addNewPost({ title, body, userId }).unwrap();

      setTitle('');
      setBody('');
      setUserId(0);
      navigate('/');
    } catch (err) {
      console.error('Failed to save the post', err);
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
