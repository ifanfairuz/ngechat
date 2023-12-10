import { io, Socket } from "socket.io-client";
import { authToPerson } from "./data";
import { link } from "./link";

export const client = (person: Person) => {
  const socket: Socket<SocketEventMap> = io({
    path: link("/api/socket"),
    query: {
      user: JSON.stringify(person),
    },
  });

  socket.on("connect_error", async (err) => {
    console.log(`connect_error due to ${err.message}`);
  });

  return socket;
};
