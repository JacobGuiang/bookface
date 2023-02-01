import { useState, createContext, ReactElement } from 'react';
import { useQuery } from 'react-query';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage';
import LoginService from './services/authService';
import { CurrentUserContextType, User } from './types';
import { logError } from './utils/helpers';

export const CurrentUserContext = createContext<CurrentUserContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
});

const App = (): ReactElement => {
  const query = useQuery('currentUser', LoginService.getCurrentUser);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (query.isLoading) {
    console.log('getting current user');
  }
  if (query.isError) {
    logError(query.error);
  }
  if (!currentUser && query.data) {
    setCurrentUser(query.data as User);
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      {!currentUser && <LoginPage />}
      {currentUser && (
        <>
          <Topbar />
          <Sidebar />
        </>
      )}
    </CurrentUserContext.Provider>
  );
};

export default App;
