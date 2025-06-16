import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { useUser } from "../hooks/useUser";
import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import {
  Chat,
  Message as MessageType,
  SocketMessageType,
} from "../types/types";
import { useTranslation } from "react-i18next";
import Menus from "./Menus";
import { MdPhotoLibrary } from "react-icons/md";
import { useUploadMedia } from "../hooks/useUploadMedia";
import toast from "react-hot-toast";

type MessageInputProps = {
  bottomRef: React.RefObject<HTMLDivElement | null>;
  chat: Chat;
  isConnected: boolean;
  replyingTo?: MessageType | null;
  clearReplyingTo?: () => void;
};

function MessageInput({
  bottomRef,
  chat,
  isConnected,
  replyingTo,
  clearReplyingTo,
}: MessageInputProps) {
  const { t } = useTranslation("chats");
  const { user } = useUser();
  const { sendMedia, isLoading: isMediaLoading } = useUploadMedia();

  const [message, setMessage] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Media size exceeds 1MB");
        setMediaPreview("");
        setMediaFile(null);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setMediaPreview(previewUrl);
      setMediaFile(file);
    }
  }

  async function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !chat) return;
    if (mediaFile === null && message.trim() === "") return; // Prevent sending empty messages

    const socketData: SocketMessageType = {
      content: message,
      chatId: chat?.id,
      replyToId: replyingTo?.id || null,
    };

    try {
      if (mediaFile) {
        const media = await sendMedia(mediaFile);
        socketData.media = media;
      }
      socket.emit("send_message", socketData);

      // Reset input fields
      setMessage("");
      setMediaPreview("");
      setMediaFile(null);
      clearReplyingTo?.();

      // Scroll to the bottom after sending a message
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 50);
    } catch (err) {
      console.error("Failed to send message with media:", err);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e);
    }
  }

  // cleanup function to revoke the object URL
  useEffect(() => {
    return () => {
      if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    };
  }, [mediaPreview]);

  return (
    <>
      <form
        onSubmit={handleMessageSubmit}
        className="flex flex-col gap-4 border-t-2 border-[var(--color-grey-100)] "
      >
        {mediaPreview && (
          <div className="relative w-32 h-32 flex justify-center ml-6 lg:ml-12 mt-4 mb-2">
            <img
              src={mediaPreview}
              alt="Preview"
              className={`w-32 h-32 object-cover mb-2 rounded-lg transition-opacity ${
                isMediaLoading ? "opacity-50" : "opacity-100"
              }`}
            />
            {/* Spinner overlay */}
            {isMediaLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
            {/* Remove button */}
            {!isMediaLoading && (
              <button
                type="button"
                onClick={() => {
                  setMediaPreview("");
                  setMediaFile(null);
                }}
                className="absolute top-2 right-2 bg-white text-black text-xs px-1 rounded-full"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="flex gap-4 items-cente  px-6 lg:px-12 py-6">
          <Menus>
            <Menus.Menu>
              <Menus.Toggle
                icon={<FaPlus className="text-xl" />}
                id="menu"
                className="!p-3 hover:bg-none rounded-full transition-transform duration-200 focus-within:rotate-135"
                position="above"
              />
              <Menus.List id="menu">
                <Menus.Button
                  className="text-[1rem]"
                  icon={<MdPhotoLibrary className="text-blue-400" />}
                  onClick={handlePhotoClick}
                >
                  Photos
                </Menus.Button>
              </Menus.List>
            </Menus.Menu>
          </Menus>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            placeholder={t("typeMessage")}
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="w-full resize-none h-max focus:outline-none bg-[var(--color-grey-100)] px-6 py-2 shadow-sm rounded-lg max-h-[200px] overflow-y-auto"
          />
          <button
            type="submit"
            className="text-xl disabled:opacity-50"
            disabled={!isConnected || (!message && !mediaFile)}
          >
            <IoMdSend />
          </button>
        </div>
      </form>
    </>
  );
}

export default MessageInput;
