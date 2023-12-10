import { RxDocument } from "rxdb";
import { Server } from "socket.io";
import * as persons from "@/db/persons";
import * as chats from "@/db/chats";
import { link } from "./link";

export const createServer = async (server: SocketServer) => {
  const socket = new Server<SocketEventMap, SocketEventMap, SocketEventMap>({
    path: link("/api/socket"),
    addTrailingSlash: false,
  });
  socket.listen(server);

  socket.on("connect", async (io) => {
    if (
      typeof io.handshake.query.user == "string" &&
      io.handshake.query.user != ""
    ) {
      const person: Person = JSON.parse(io.handshake.query.user);
      const room = `user:${person.id}`;
      await persons.addPerson(person);
      if ((await socket.in(room).fetchSockets()).length == 0) {
        io.join(room);
        persons.setOnline(person.id, true);
        io.broadcast.emit("status-online", {
          id: person.id,
          isOnline: true,
        });
      }

      io.on("typings", (data) => {
        const r_room = `user:${data.personid}`;
        io.to(r_room).emit("typings", { personid: person.id });
      });

      io.on("send-message", ({ data }, callback) => {
        callback && callback();
        const chat: Chat = { ...data, status: "sent" };
        chats.pushChat(chat);
        const r_room = `user:${data.to.id}`;
        io.to(r_room).emit("receive-message", { data: chat });
      });

      io.on("status-message", (data) => {
        chats.changeStatus(data);
        const r_room = `user:${data.interlocutor}`;
        io.to(r_room).emit("status-message", {
          ...data,
          interlocutor: person.id,
        });
      });

      io.on("read-all-messages", async (data) => {
        let docs: RxDocument<ChatDB, {}>[];
        if (data.chats == "all") {
          docs = await chats.changeAllStatusWith(
            data.interlocutor,
            person.id,
            data.status
          );
        } else {
          docs = await chats.changeAllStatuses(data.chats, data.status);
        }
        const r_room = `user:${data.interlocutor}`;
        docs.forEach((doc) => {
          io.to(r_room).emit("status-message", {
            chat: doc.id,
            status: data.status,
            interlocutor: person.id,
          });
        });
      });

      io.once("disconnect", async () => {
        io.leave(room);
        io.removeAllListeners();
        if ((await socket.in(room).fetchSockets()).length == 0) {
          const lastSeen = new Date(Date.now()).toISOString();
          persons.setOnline(person.id, false, lastSeen);
          io.broadcast.emit("status-online", {
            id: person.id,
            isOnline: false,
            lastSeen,
          });
        }
      });
    }
  });

  return socket;
};
