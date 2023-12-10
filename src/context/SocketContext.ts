import { createContext, useContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { client } from "@/lib/socket-client";

interface SocketContextType {
  user?: Person;
  io?: Socket<SocketEventMap>;
  handleStatusOnline?: SocketEventMap["status-online"];
  handleSomeoneTyping?: SocketEventMap["typings"];
  handleReceiveMessage?: SocketEventMap["receive-message"];
  handleStatusMessage?: SocketEventMap["status-message"];
  onStatusOnlie: (handler: SocketEventMap["status-online"]) => () => void;
  onSomeoneTyping: (handler: SocketEventMap["typings"]) => () => void;
  onReceiveMessage: (handler: SocketEventMap["receive-message"]) => () => void;
  onStatusMessage: (handler: SocketEventMap["status-message"]) => () => void;
  typing: SocketEventMap["typings"];
  sendMessage: SocketEventMap["send-message"];
  changeStatusMessage: SocketEventMap["status-message"];
  readAllMessages: SocketEventMap["read-all-messages"];
  connect: (user: Person) => () => void;
}

interface SocketContextListener {
  handleStatusOnline?: SocketEventMap["status-online"];
  handleSomeoneTyping?: SocketEventMap["typings"];
  handleReceiveMessage?: SocketEventMap["receive-message"];
  handleStatusMessage?: SocketEventMap["status-message"];
}

const SocketContext = createContext<SocketContextType>({
  onStatusOnlie(handler) {
    this.handleStatusOnline = handler;
    this.io?.on("status-online", this.handleStatusOnline);
    return () => {
      this.io?.off("status-online", this.handleStatusOnline);
    };
  },
  onSomeoneTyping(handler) {
    this.handleSomeoneTyping = handler;
    this.io?.on("typings", this.handleSomeoneTyping);
    return () => {
      this.io?.off("typings", this.handleSomeoneTyping);
    };
  },
  onReceiveMessage(handler) {
    this.handleReceiveMessage = (data) => {
      const interlocutor =
        this.user?.id == data.data.from.id
          ? data.data.to.id
          : data.data.from.id;
      this.changeStatusMessage({
        interlocutor,
        chat: data.data.id,
        status: "received",
      });
      handler(data);
    };
    this.io?.on("receive-message", this.handleReceiveMessage);
    return () => {
      this.io?.off("receive-message", this.handleReceiveMessage);
    };
  },
  onStatusMessage(handler) {
    this.handleStatusMessage = handler;
    this.io?.on("status-message", this.handleStatusMessage);
    return () => {
      this.io?.off("status-message", this.handleStatusMessage);
    };
  },
  typing(payload) {
    this.io?.emit("typings", payload);
  },
  sendMessage(payload, callback?: () => void) {
    this.io?.emit("send-message", payload, callback);
  },
  changeStatusMessage(payload) {
    this.io?.emit("status-message", payload);
  },
  readAllMessages(payload) {
    this.io?.emit("read-all-messages", payload);
  },
  connect(user) {
    this.user = user;
    this.io = client(user);

    return () => {
      this.io?.removeAllListeners();
      this.io?.disconnect();
      this.io = undefined;
    };
  },
});

export const useSocket = (user?: Person, listener?: SocketContextListener) => {
  const context = useContext(SocketContext);

  useEffect(() => {
    if (user) {
      const unsubscribe = context.connect(user);
      if (listener?.handleStatusOnline) {
        context.onStatusOnlie(listener.handleStatusOnline);
      }
      if (listener?.handleSomeoneTyping) {
        context.onSomeoneTyping(listener.handleSomeoneTyping);
      }
      if (listener?.handleReceiveMessage) {
        context.onReceiveMessage(listener.handleReceiveMessage);
      }
      if (listener?.handleStatusMessage) {
        context.onStatusMessage(listener.handleStatusMessage);
      }

      return unsubscribe;
    }
  }, []);

  return context;
};
