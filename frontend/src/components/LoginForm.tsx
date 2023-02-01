import { useState, useContext, SyntheticEvent } from 'react';
import { useMutation } from 'react-query';
import { logError } from '../utils/helpers';
import authService from '../services/authService';
import { CurrentUserContext } from '../App';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const currentUserContext = useContext(CurrentUserContext);

  const mutation = useMutation(authService.login, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: (data) => {
      console.log('logging in');
      currentUserContext.setCurrentUser(data);
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
