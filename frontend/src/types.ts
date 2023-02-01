interface BaseUser {
  username: string;
  name: {
    firstName: string;
    lastName: string;
  };
}

export interface User extends BaseUser {
  id: string;
  friends: User[];
  friendRequestsFrom: User[];
  friendRequestsTo: User[];
}

export interface NewUser extends BaseUser {
  password: string;
}
