interface StatusOnlinePayload {
  id: string;
  isOnline: boolean;
  lastSeen?: string;
}
interface WithMessageData {
  data: Chat;
}
interface SendMessagePayload extends WithMessageData {}
interface ReceiveMessagePayload extends WithMessageData {}
type ChangeChatStatusPayload = {
  interlocutor: Person["id"];
  chat: Chat["id"];
  status: ChatStatus;
};
type ChangeChatAllStatusPayload = {
  interlocutor: Person["id"];
  chats: Chat["id"][] | "all";
  status: ChatStatus;
};
type TypingsPayload = {
  personid: Person["id"];
};

interface SocketEventMap {
  "status-online": (data: StatusOnlinePayload) => void;
  typings: (data: TypingsPayload) => void;
  "send-message": (data: SendMessagePayload, callback?: () => void) => void;
  "receive-message": (data: ReceiveMessagePayload) => void;
  "status-message": (data: ChangeChatStatusPayload) => void;
  "read-all-messages": (data: ChangeChatAllStatusPayload) => void;
}
