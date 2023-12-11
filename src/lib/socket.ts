import { Server, Socket } from "socket.io";
import * as persons from "@/db/persons";
import * as chats from "@/db/chats";
import { link } from "./link";
import { connection } from "@/db/db";

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
      const user: Person = JSON.parse(io.handshake.query.user);
      const room = `user:${user.id}`;
      if ((await socket.in(room).fetchSockets()).length == 0) {
        io.join(room);
        user.isOnline = true;
        io.broadcast.emit("status-online", {
          id: user.id,
          isOnline: true,
        });
      }
      const db = connection();
      persons.upsertPerson(db, user).finally(() => db.end());

      listenUserEvent(io, user);

      io.once("disconnect", async () => {
        io.leave(room);
        io.removeAllListeners();
        if ((await socket.in(room).fetchSockets()).length == 0) {
          const lastSeen = new Date(Date.now()).toISOString();
          const db = connection();
          persons
            .setOnline(db, user.id, false, lastSeen)
            .finally(() => db.end());
          io.broadcast.emit("status-online", {
            id: user.id,
            isOnline: false,
            lastSeen,
          });
        }
      });
    }
  });

  return socket;
};

const listenUserEvent = (
  io: Socket<SocketEventMap, SocketEventMap, SocketEventMap>,
  user: Person
) => {
  io.on("typings", (data) => {
    const r_room = `user:${data.personid}`;
    io.to(r_room).emit("typings", { personid: user.id });
  });

  io.on("send-message", ({ data }, callback) => {
    callback && callback();
    const db = connection();
    const chat: Chat = { ...data, status: "sent" };
    chats.insertChat(db, chat).finally(() => db.end());
    const r_room = `user:${data.to.id}`;
    io.to(r_room).emit("receive-message", { data: chat });
  });

  io.on("status-message", (data) => {
    const db = connection();
    chats.changeStatus(db, data).finally(() => db.end());
    const r_room = `user:${data.interlocutor}`;
    io.to(r_room).emit("status-message", {
      ...data,
      interlocutor: user.id,
    });
  });

  io.on("read-all-messages", async (data) => {
    const db = connection();
    let datas: Chat[];
    if (data.chats == "all") {
      datas = await chats.changeAllStatusWith(
        db,
        data.interlocutor,
        user.id,
        data.status
      );
    } else {
      datas = await chats.changeAllStatuses(db, data.chats, data.status);
    }
    db.end();

    const r_room = `user:${data.interlocutor}`;
    datas.forEach((data) => {
      io.to(r_room).emit("status-message", {
        chat: data.id,
        status: data.status,
        interlocutor: user.id,
      });
    });
  });
};
