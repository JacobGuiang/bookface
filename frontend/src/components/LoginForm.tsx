import { useState, SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import authService from '../services/auth';
import { logError } from '../utils/helpers';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation(authService.login, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: (data) => {
      console.log('logging in');
      queryClient.setQueryData('currentUser', data);
    },
  });

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    mutation.mutate({ username, password });
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
