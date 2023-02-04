import { useState } from 'react';
import { useMutation } from 'react-query';
import userService from '../services/user';
import { logError } from '../utils/helpers';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const mutation = useMutation(userService.createUser, {
    onError: (error) => {
      logError(error);
    },
    onSuccess: () => {
      console.log('registered');
      setUsername('');
      setPassword('');
      setFirstName('');
      setLastName('');
    },
  });

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    mutation.mutate({ username, password, name: { firstName, lastName } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          placeholder="First name"
          value={firstName}
          onChange={({ target }) => setFirstName(target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Last name"
          value={lastName}
          onChange={({ target }) => setLastName(target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <input
          placeholder="New Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default RegisterForm;
