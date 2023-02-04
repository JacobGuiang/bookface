import { createContext } from 'react';
import { useQuery } from 'react-query';
import { Outlet } from 'react-router-dom';
import { User } from './types';
import loginService from './services/auth';
import Header from './components/Header';
import Login from './components/Login';
import { logError } from './utils/helpers';

export const CurrentUserContext = createContext<User | null>(null);

const App = () => {
  const query = useQuery('currentUser', loginService.getCurrentUser, {
    retry: false,
  });

  if (query.isLoading) {
    console.log('getting current user');
    return <Login />;
  }
  if (query.isError) {
    logError(query.error);
    return <Login />;
  }

  const currentUser = query.data;

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header />
      <Outlet />
    </CurrentUserContext.Provider>
  );
};

export default App;
