import { createContext } from 'react';
import { useQuery } from 'react-query';
import Topbar from './components/Topbar';
import LoginPage from './components/LoginPage';
import loginService from './services/authService';
import { User } from './types';
import { logError } from './utils/helpers';
import { Outlet } from 'react-router-dom';

export const CurrentUserContext = createContext<User | null>(null);

const App = () => {
  const query = useQuery('currentUser', loginService.getCurrentUser);

  if (query.isLoading) {
    console.log('getting current user');
  }
  if (query.isError) {
    logError(query.error);
  }

  const currentUser = query.data;

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Topbar />
      <Outlet />
    </CurrentUserContext.Provider>
  );
};

export default App;
