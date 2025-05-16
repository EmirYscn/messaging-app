import { MEDIA_TYPE } from "@prisma/client";
import { prisma } from "./prismaClient";

export const uploadMedia = async (
  publicUrl: string,
  filePath: string,
  type: MEDIA_TYPE
) => {
  const media = await prisma.media.create({
    data: {
      url: publicUrl,
      filePath,
      type,
    },
  });

  return media;
};
