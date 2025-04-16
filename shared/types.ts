export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
  AUTHOR = "AUTHOR",
}
export enum CHAT_TYPE {
  GROUP = "GROUP",
  PRIVATE = "PRIVATE",
}

export enum MESSAGE_TYPE {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
}

export type Profile = {
  id: string;
  bio?: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;

  userId: string;
  user?: User;
};

export type User = {
  id: string;
  email: string;
  username?: string | null;
  password?: string | null;
  role?: ROLE;
  avatar?: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;

  profile?: Profile | null;
  chats?: Chat[];
  messages?: Message[];
};

export type Chat = {
  id: string;
  name?: string;
  type: CHAT_TYPE;

  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;

  lastMessageId?: string;
  lastMessage?: Message;
};

export type Message = {
  id: string;
  content: string;
  type: MESSAGE_TYPE;

  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;

  senderId: string;
  sender: User;

  chatId: string;
  chat: Chat;
};

// Optional: Type guards and utility types
export function isAdmin(user: User): boolean {
  return user.role === ROLE.ADMIN;
}

export function isAuthor(user: User): boolean {
  return user.role === ROLE.AUTHOR;
}

export type UpdateUser = User & Profile;
