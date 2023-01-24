import React, { useState, ReactElement } from 'react';

const LoginForm = (): ReactElement => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (): void => {
    return;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          value={username}
          onChange={({ target }) => {
            setUsername(target.value);
          }}
        />
      </div>
      <div>
        password
        <input
          value={password}
          onChange={({ target }) => {
            setPassword(target.value);
          }}
          type="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
