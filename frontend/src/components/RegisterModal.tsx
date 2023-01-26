import { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { registerUser } from '../reducers/userReducer';

const RegisterModal = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    dispatch(registerUser({ username, password, firstName, lastName }));
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

export default RegisterModal;
