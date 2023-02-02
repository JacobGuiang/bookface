import { createContext, ReactElement } from 'react';
import { useQuery } from 'react-query';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import LoginService from './services/authService';
import { User } from './types';
import { logError } from './utils/helpers';

export const CurrentUserContext = createContext<User | null>(null);

const App = (): ReactElement => {
  const query = useQuery('currentUser', LoginService.getCurrentUser);

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
      <Sidebar />
    </CurrentUserContext.Provider>
  );
};

export default App;
