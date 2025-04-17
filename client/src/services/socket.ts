import io from "socket.io-client";

export const socket = io("http://localhost:3000", {
  extraHeaders: {
    authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
});
