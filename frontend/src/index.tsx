import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorPage from './components/ErrorPage';
import Users from './components/Users';
import User from './components/User';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import FriendSidebar from './components/FriendSidebar';
import Friends from './components/Friends';
import FriendRequests from './components/FriendRequests';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'users/:id',
        element: <User />,
      },
      {
        path: 'friends',
        element: (
          <>
            <FriendSidebar />
            <FriendRequests />
          </>
        ),
      },
      {
        path: 'friends/list',
        element: (
          <>
            <FriendSidebar />
            <Friends />
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
