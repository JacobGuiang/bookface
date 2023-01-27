export interface User {
  id: string;
  username: string;
}

export interface NewUser {
  username: string;
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
}
