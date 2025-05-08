import { useMutation } from "@tanstack/react-query";
import { useChat } from "./useChat";
import { uploadImageMessage } from "../services/apiMessages";

export const useSendImage = () => {
  const { chat } = useChat();

  const { mutateAsync: sendImage, isPending: isLoading } = useMutation({
    mutationFn: async (imageFile: File) => {
      if (!chat) return;
      return await uploadImageMessage(chat.id, imageFile);
      // return image;
    },
  });

  return { sendImage, isLoading };
};
