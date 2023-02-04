export interface Name {
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  name: Name;
}

export interface FriendData {
  friends: User[];
  friendRequestsFrom: User[];
  friendRequestsTo: User[];
}
