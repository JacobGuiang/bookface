interface Name {
  firstName: string;
  lastName: string;
}

export interface User {
  id: string;
  name: Name;
}

export interface UserToRegister {
  username: string;
  password: string;
  name: Name;
}
