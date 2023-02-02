interface Name {
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  username: string;
  name: Name;
}

export interface UserToRegister {
  username: string;
  name: Name;
  password: string;
}

export interface UserIndexDetails {
  id: string;
  name: Name;
  friendRequestsFrom: string[];
  friendRequestsTo: string[];
  friends: string[];
}
