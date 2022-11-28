import { useState, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../../../hooks/redux-hooks';

import { selectPostById } from '../redux/postsSlice';
import { selectAllUsers } from '../../users/redux/usersSlice';
import { deletePost_API, updatePost_API } from '../redux/postsActionCreators';

import { STATUS, STATUS_OPTIONS } from '../../../types';

export const EditPostFormPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const post = useAppSelector((state) => selectPostById(state, Number(postId)));
  const users = useAppSelector(selectAllUsers);

  const [title, setTitle] = useState(post?.title);
  const [body, setBody] = useState(post?.body);
  const [userId, setUserId] = useState(post?.userId);
  const [requestStatus, setRequestStatus] = useState<STATUS_OPTIONS>(STATUS.IDLE);
  console.log('%c-> developmentConsole: requestStatus= ', 'color:#77dcfd', requestStatus);

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  const onTitleChanged = (e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const onContentChanged = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBody(e.target.value);
  const onAuthorChanged = (e: ChangeEvent<HTMLSelectElement>) =>
    setUserId(Number(e.target.value));

  const isValidForm =
    [title, body, userId].every(Boolean) && requestStatus === STATUS.IDLE;

  const infoExist = title && body && userId;

  const onSavePostClicked = () => {
    if (isValidForm && infoExist) {
      setRequestStatus(STATUS.PENDING);
      try {
        dispatch(
          updatePost_API({
            ...post,
            userId,
            title,
            body,
          })
        ).unwrap();

        setTitle('');
        setBody('');
        setUserId(0);
        navigate(`/post/${postId}`);
      } catch (err) {
        console.error('Failed to save the post', err);
      } finally {
        setRequestStatus(STATUS.IDLE);
      }
    }
  };

  const onDeletePostClicked = () => {
    try {
      setRequestStatus(STATUS.PENDING);
      dispatch(deletePost_API(post)).unwrap();

      setTitle('');
      setBody('');
      setUserId(0);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete the post', err);
    } finally {
      setRequestStatus(STATUS.IDLE);
    }
  };

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  return (
    <section>
      <h2>Edit Post</h2>
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
        <button className="deleteButton" type="button" onClick={onDeletePostClicked}>
          Delete Post
        </button>
      </form>
    </section>
  );
};
