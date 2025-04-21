export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLElement>;
export type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
>;

export type {
  ROLE,
  CHAT_TYPE,
  MESSAGE_TYPE,
  FRIEND_REQUEST_STATUS,
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
} from "../../../shared/types";
