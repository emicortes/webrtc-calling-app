import { User } from "./users.models";

export interface Message {
  type: string;
}

export interface IncomingMessage extends Message {
  from: User;
}

export interface OutgoingMessage extends Message {
  target: string;
}
