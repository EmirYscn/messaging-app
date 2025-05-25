// This file contains the types and enums used throughout the application.

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  AUTHOR = "AUTHOR",
}
export enum CHAT_TYPE {
  PUBLIC = "PUBLIC",
  GROUP = "GROUP",
  PRIVATE = "PRIVATE",
}

export enum MESSAGE_TYPE {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  SYSTEM = "SYSTEM",
}

export enum FRIEND_REQUEST_STATUS {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
}
export enum MEDIA_TYPE {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}

export type Profile = {
  readonly id: string;
  bio?: string | null;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  readonly deletedAt?: Date | string | null;

  userId: string;
  user?: User;
};

export type User = {
  readonly id: string;
  email: string;
  username?: string | null;
  password?: string | null;
  role?: ROLE;
  avatar?: string | null;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  readonly deletedAt?: Date | string | null;

  profile?: Profile | null;
  chats?: Chat[];
  messages?: Message[];
};

export type Chat = {
  readonly id: string;
  name?: string;
  avatar?: string;
  type: CHAT_TYPE;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  readonly deletedAt?: Date | string | null;

  lastMessageId?: string;
  lastMessage?: Message;

  users?: User[];
};

export type Message = {
  readonly id: string;
  content: string;
  type: MESSAGE_TYPE;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  readonly deletedAt?: Date | string | null;

  senderId: string;
  sender?: User;

  chatId: string;
  chat?: Chat;

  media?: Media[];
};

export type Media = {
  readonly id: string;
  url: string;
  type: MEDIA_TYPE;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;

  messageId: string;
  message: Message;
};

export type FriendRequest = {
  readonly id: string;
  status: FRIEND_REQUEST_STATUS;

  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;

  senderId: string;
  sender: User;

  receiverId: string;
  receiver: User;
};

// Optional: Type guards and utility types
export function isAdmin(user: User): boolean {
  return user.role === ROLE.ADMIN;
}

export function isAuthor(user: User): boolean {
  return user.role === ROLE.AUTHOR;
}

export type UpdateUser = User & Profile;

type CommonImmutableFields = "id" | "createdAt" | "updatedAt" | "deletedAt";

type ImmutableUserFields =
  | CommonImmutableFields
  | "profile"
  | "chats"
  | "messages";
export type CreateUserDTO = Omit<User, ImmutableUserFields>;

export type UpdateUserDTO = Partial<CreateUserDTO>;

type ImmutableMessageFields = CommonImmutableFields | "sender" | "chat";
export type CreateMessageDTO = Omit<Message, ImmutableMessageFields>;
export type UpdateMessageDTO = Partial<CreateMessageDTO>;

type ImmutableChatFields =
  | CommonImmutableFields
  | "users"
  | "messages"
  | "lastMessage"
  | "lastMessageId";
export type CreateChatDTO = Omit<Chat, ImmutableChatFields>;
export type UpdateChatDTO = Partial<CreateChatDTO>;

// Socket.io types

export type SocketMessageType = {
  content: string;
  chatId: string;
  media?: Media;
};

export interface ServerToClientEvents {
  receive_message: (data: Message) => void;
  add_to_active_users: (data: User) => void;
  remove_from_active_users: (data: User) => void;
  active_users_list: (users: User[]) => void;
  room_joined: (data: { chatId: string }) => void;
  chat_created: () => void;
  chat_updated: () => void;
  error_occurred: (message: { message: string }) => void;
  friend_requests_updated: () => void;
  friends_updated: () => void;
  messages_updated: (data: { chatId: string }) => void;
  user_left_group: (data: { chatId: string; leavingUser: User }) => void;
  users_joined_group: (data: { chatId: string; joinedUsers: User[] }) => void;
}

export interface ClientToServerEvents {
  send_message: (data: SocketMessageType) => void;
  join_room: (data: { chatId: string; chatType: CHAT_TYPE }) => void;
  leave_room: (data: { chatId: string; chatType: CHAT_TYPE }) => void;
  add_to_active_users: (data: User) => void;
  remove_from_active_users: (data: User) => void;
  active_users_list: (users: User[]) => void;
}
