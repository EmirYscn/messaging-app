import { useMutation } from "@tanstack/react-query";
import { uploadMedia } from "../services/apiMessages";

export const useUploadMedia = () => {
  const {
    mutateAsync: sendMedia,
    isPending: isLoading,
    data: media,
  } = useMutation({
    mutationFn: async (imageFile: File) => {
      const media = await uploadMedia(imageFile);
      return media;
    },
  });

  return { sendMedia, isLoading, media };
};
