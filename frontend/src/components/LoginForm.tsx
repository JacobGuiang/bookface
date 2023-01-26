import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { loginUser } from '../reducers/userReducer';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      dispatch(loginUser(username, password));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={({ target }) => {
            setUsername(target.value);
          }}
        />
      </div>
      <div>
        <input
          placeholder="Password"
          value={password}
          onChange={({ target }) => {
            setPassword(target.value);
          }}
          type="password"
        />
      </div>
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
