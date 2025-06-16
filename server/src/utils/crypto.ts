import { Message, Prisma } from "@prisma/client";
import crypto from "crypto";
import config from "../config/config";

const ENCRYPTION_KEY = config.encryptKey;

export type MessageWithRelations = Prisma.MessageGetPayload<{
  select: {
    id: true;
    content: true;
    type: true;
    createdAt: true;
    updatedAt: true;
    deletedAt: true;
    sender: {
      select: {
        id: true;
        username: true;
        avatar: true;
        role: true;
      };
    };
    media: {
      select: {
        id: true;
        url: true;
        type: true;
      };
    };
    replyTo: {
      select: {
        id: true;
        content: true;
        senderId: true;
        sender: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
    };
  };
}>;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be a 32-character string.");
}
const IV_LENGTH = 16; // For AES, this is always 16

export const encryptText = (text: string): string => {
  if (typeof text !== "string") {
    throw new TypeError("encryptText expects a string");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return iv.toString("base64") + ":" + encrypted;
};

export const decryptText = (encryptedText: string): string => {
  const [ivBase64, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivBase64, "base64");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY!),
    iv
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export function decryptMessageContent(message: Message | null): Message | null {
  if (!message || !message.content) return message;
  try {
    return {
      ...message,
      content: decryptText(message.content),
    };
  } catch (error) {
    console.error("Failed to decrypt message content:", error);
    return {
      ...message,
      content: "[Error decrypting message]",
    };
  }
}

export function decryptMessageContentWithRelations(
  message: MessageWithRelations | null
): MessageWithRelations | null {
  if (!message || !message.content) return message;
  try {
    return {
      ...message,
      content: decryptText(message.content),
      replyTo: message.replyTo
        ? {
            ...message.replyTo,
            content: message.replyTo.content
              ? decryptText(message.replyTo.content)
              : message.replyTo.content,
          }
        : message.replyTo,
    };
  } catch (error) {
    console.error("Failed to decrypt message content:", error);
    return {
      ...message,
      content: "[Error decrypting message]",
      replyTo: message.replyTo
        ? {
            ...message.replyTo,
            content: "[Error decrypting message]",
          }
        : message.replyTo,
    };
  }
}
