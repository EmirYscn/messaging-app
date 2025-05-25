export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLElement>;
export type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
>;

import {
  MESSAGE_TYPE,
  MEDIA_TYPE,
  CHAT_TYPE,
  ROLE,
  FRIEND_REQUEST_STATUS,
} from "../../../shared/types";

export { MESSAGE_TYPE, MEDIA_TYPE, CHAT_TYPE, ROLE, FRIEND_REQUEST_STATUS };

export type {
  User,
  Profile,
  Chat,
  Message,
  UpdateUser,
  CreateUserDTO,
  UpdateUserDTO,
  CreateChatDTO,
  UpdateChatDTO,
  CreateMessageDTO,
  UpdateMessageDTO,
  ClientToServerEvents,
  ServerToClientEvents,
  FriendRequest,
  Media,
  SocketMessageType,
} from "../../../shared/types";
