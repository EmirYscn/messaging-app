// import axios from "axios";
// import { Message } from "../types/types";
// import { api } from "./apiAuth";

// export const getMessages = async (
//   chatId: string
// ): Promise<{ messages: Message[]; count: number }> => {
//   try {
//     const res = await api.get(`/api/v1/messages/${chatId}/messages`);
//     return { messages: res.data.messages, count: res.data.count };
//   } catch (error: unknown) {
//     // Extract error message from response
//     if (axios.isAxiosError(error)) {
//       const serverMessage =
//         error.response?.data?.message || "Couldn't fetch messages";
//       throw new Error(serverMessage);
//     }

//     throw new Error("An unexpected error occurred.");
//   }
// };
