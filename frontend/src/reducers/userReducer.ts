import { AnyAction } from 'redux';
import { RootState } from '../store';
import { ThunkAction } from 'redux-thunk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, NewUser } from '../types';
import userService from '../services/userService';
import authService from '../services/authService';
import { isAxiosError } from 'axios';

type UserState = User | null;

const initialState = null as UserState;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser =
  (
    username: string,
    password: string
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const user = await authService.login({ username, password });
      dispatch(setUser(user));
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else {
        console.log(err);
      }
    }
  };

export const logoutUser =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
      await authService.logout();
      dispatch(clearUser());
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else {
        console.log(err);
      }
    }
  };

export const getLoggedInUser =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
      const user = await userService.getLoggedInUser();
      dispatch(setUser(user));
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else {
        console.log(err);
      }
    }
  };

export const registerUser =
  (userToRegister: NewUser): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const user = await userService.createUser(userToRegister);
      dispatch(setUser(user));
      dispatch(loginUser(user.username, user.password));
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        console.log(err.response.data.error);
      } else {
        console.log(err);
      }
    }
  };

export default userSlice.reducer;
