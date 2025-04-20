export type FormEvent = React.FormEvent<HTMLFormElement>;
export type MouseEvent = React.MouseEvent<HTMLElement>;
export type ChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement
>;

export type {
  ROLE,
  CHAT_TYPE,
  MESSAGE_TYPE,
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
} from "../../../shared/types";
