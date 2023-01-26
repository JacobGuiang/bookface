import React, { ReactElement, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { getLoggedInUser, logoutUser } from './reducers/userReducer';
import LoginForm from './components/LoginForm';

const App = (): ReactElement => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, []);

  const user = useAppSelector((state) => state.user);

  if (!user) {
    return (
      <div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <div>{user.username}</div>
      <button onClick={() => dispatch(logoutUser())}>logout</button>
    </div>
  );
};

export default App;
