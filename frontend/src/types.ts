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

export interface Comment {
  id: string;
  content: string;
  author: User;
  date: Date;
}

export interface Post {
  id: string;
  content: {
    text: string;
  };
  author: User;
  comments: Comment[];
  date: Date;
}
