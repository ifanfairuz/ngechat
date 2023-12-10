import { Session } from "@auth0/nextjs-auth0";
import { Server } from "http";
import { Socket } from "net";
import { Server as IOServer } from "socket.io";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { UserProfile } from "@auth0/nextjs-auth0/client";
import { PropsWithChildren } from "react";

declare global {
  interface Person {
    id: string;
    name: string;
    imageUri: string;
    lastSeen?: string;
    isOnline: boolean;
  }

  interface Persons {
    [key: string]: Person;
  }

  type ChatStatus = "send" | "sent" | "received" | "read";

  interface Chat {
    id: string;
    to: Person;
    from: Person;
    text: string;
    date: string;
    status: ChatStatus;
  }

  interface Chats {
    [key: string]: Chat[];
  }

  interface PersonProps {
    user: Person;
    lastChat?: Chat;
    selected?: boolean;
    unread?: number;
    onSelect?: () => void;
  }

  interface BubbleProps {
    chat: Chat;
    me: boolean;
    prev?: Chat;
    next?: Chat;
    firstunread?: boolean;
  }

  interface SearchProps {
    value: string;
    onChange: (value: string) => void;
  }

  type OnChatSubmit = (text: string) => void;
  type OnChatTyping = (id: Person["id"]) => void;

  interface HeaderProps {
    onAdd: () => void;
  }

  type ModalProps<C = { [key: string]: any }> = PropsWithChildren<C> & {
    show: boolean;
    header?: string;
    head?: React.JSX.Element;
    onClose?: () => void;
  };

  interface ChatBoxProps {
    chats?: Chat[];
    user?: Person;
    typing?: boolean;
    onTyping: OnChatTyping;
    onSubmit: OnChatSubmit;
    onReadAllMessage?: (id: Person["id"]) => void;
  }

  interface ChatFormElement {
    focus: () => void;
  }

  interface ChatBoxElement {
    focus: () => void;
    scrollToBottom: (force?: boolean, callback?: () => void) => void;
  }

  interface ChatFormProps {
    onTyping: () => void;
    onSubmit: OnChatSubmit;
  }

  interface BubbleStatusProps {
    status: ChatStatus;
  }

  interface Auth0User extends UserProfile {}

  interface Auth0Session extends Session {
    user?: Auth0User | null;
  }

  type GetSession = (
    ...args:
      | [IncomingMessage, ServerResponse]
      | [NextApiRequest, NextApiResponse]
      | [NextRequest, NextResponse]
      | []
  ) => Promise<Auth0Session | null | undefined>;

  type WithSessionContext<
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData
  > = GetServerSidePropsContext<Params, Preview> & { session: Auth0Session };

  type WithSessionHandler<
    Props extends Record<string, any> = Record<string, any>,
    Params extends ParsedUrlQuery = ParsedUrlQuery,
    Preview extends PreviewData = PreviewData
  > = (
    context: WithSessionContext<Params, Preview>
  ) => Promise<GetServerSidePropsResult<Props>>;

  interface SocketServer extends Server {
    io?: IOServer | undefined;
  }
  interface SocketWithIO extends Socket {
    server: SocketServer;
  }
  interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO;
  }
  interface NextApiRequestWithSession extends NextApiRequest {
    auth: Auth0Session;
  }

  interface ChatDB extends Omit<Chat, "to" | "from"> {
    to: string;
    from: string;
  }
}
