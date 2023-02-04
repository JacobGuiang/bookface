import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Error from './components/Error';
import UserIndex from './components/UserIndex';
import UserPage from './components/UserPage';
import FriendNavbar from './components/FriendNavbar';
import Friends from './components/Friends';
import FriendRequests from './components/FriendRequests';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: 'users',
        element: <UserIndex />,
      },
      {
        path: 'users/:id',
        element: <UserPage />,
      },
      {
        path: 'friends',
        element: (
          <>
            <FriendNavbar />
            <Friends />
          </>
        ),
      },
      {
        path: 'friends/requests',
        element: (
          <>
            <FriendNavbar />
            <FriendRequests />
          </>
        ),
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
