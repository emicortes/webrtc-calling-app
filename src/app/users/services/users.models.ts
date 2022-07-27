export enum UserStatus {
  ONLINE = 'Online',
  ON_CALL = 'On call',
}

export interface User {
  id: string;
  name: string;
  status: UserStatus;
}
