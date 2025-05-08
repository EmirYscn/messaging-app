import { useEffect, useRef, useState } from "react";
import { socket } from "../services/socket";
import { useUser } from "../hooks/useUser";
import { FaPlus } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { Chat, MESSAGE_TYPE } from "../types/types";
import { useTranslation } from "react-i18next";
import Menus from "./Menus";
import { MdPhotoLibrary } from "react-icons/md";
import { useSendImage } from "../hooks/useSendImage";
import toast from "react-hot-toast";

type MessageInputProps = {
  chat: Chat;
  isConnected: boolean;
};

function MessageInput({ chat, isConnected }: MessageInputProps) {
  const { t } = useTranslation("chats");
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { sendImage } = useSendImage();

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 0.5 * 1024 * 1024) {
        toast.error("Image size exceeds 500KB");
        setImagePreview("");
        setImageFile(null);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageFile(file);
    }
  }

  async function handleMessageSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !chat) return;
    if (imageFile === null && message.trim() === "") return; // Prevent sending empty messages
    if (!user) return;
    if (message) {
      const data = {
        content: message,
        chatId: chat?.id,
        senderId: user?.id,
        type: "TEXT" as MESSAGE_TYPE,
      };
      socket.emit("send_message", data);
    }
    // let imageUrl = "";
    // if (imageFile) {
    //   imageUrl = await sendImage(imageFile);
    // }
    if (imageFile) {
      sendImage(imageFile);
    }

    // // socket.emit("send_message", {
    // //   content: message,
    // //   image: imageUrl,
    // //   chatId: chat.id,
    // //   senderId: user.id,
    // //   type: imageUrl ? "IMAGE" : "TEXT",
    // // });

    setMessage("");
    setImagePreview("");
    setImageFile(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e);
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <>
      <form
        onSubmit={handleMessageSubmit}
        className="flex flex-col gap-4 border-t-2 border-[var(--color-grey-100)] "
      >
        {imagePreview && (
          <div className="relative w-32 h-32 flex justify-center ml-6 lg:ml-12 mt-4 mb-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover mb-2 rounded-lg"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview("");
                setImageFile(null);
              }}
              className="absolute top-2 right-2 bg-white text-black text-xs px-1 rounded-full"
            >
              ✕
            </button>
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
            disabled={!isConnected || (!message && !imageFile)}
          >
            <IoMdSend />
          </button>
        </div>
      </form>
    </>
  );
}

export default MessageInput;
