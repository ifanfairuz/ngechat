import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Search } from "@/components/Search";
import { Person } from "@/components/Person";
import { ChatBox } from "@/components/ChatBox";
import { useSocket } from "@/context/SocketContext";
import { getSession } from "@/lib/session";
import { authToPerson, getInterlocutorIdChat } from "@/lib/data";
import { ModalNewChat } from "@/components/ModalNewChat";
import { ulid } from "ulid";
import { GetServerSideProps } from "next";
import { link } from "@/lib/link";

interface HomeProps {
  user: Auth0User;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  req,
  res,
}) => {
  const session = await getSession(req, res);
  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { user: session.user },
  };
};

export default function Home({ user }: HomeProps) {
  const chatBox = useRef<ChatBoxElement>(null);
  const [search, setSearch] = useState("");
  const [interlocutors, setInterlocutors] = useState<Persons>({});
  const [chats, setChats] = useState<Chats>({});
  const [typings, setTypings] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState("");
  const [modalAdd, setModalAdd] = useState(false);

  const interlocutors_filtered = useMemo(() => {
    const filtered =
      search == ""
        ? Object.values(interlocutors)
        : Object.values(interlocutors).filter((p) => {
            const s = search.toLowerCase();
            return (
              p.name.toLowerCase().includes(s) ||
              chats[p.id].find((c) => c.text.toLowerCase().includes(s))
            );
          });
    return filtered.sort((a, b) => {
      const chatsa = chats[a.id] || [];
      const timea =
        chatsa.length > 0
          ? new Date(chatsa[chatsa.length - 1].date).getTime()
          : Number.MAX_VALUE;
      const chatsb = chats[b.id] || [];
      const timeb =
        chatsb.length > 0
          ? new Date(chatsb[chatsb.length - 1].date).getTime()
          : Number.MAX_VALUE;
      return timeb - timea;
    });
  }, [search, chats, interlocutors]);

  const pushChat = (data: Chat) => {
    const interlocutorid = getInterlocutorIdChat(data, user);
    if (!interlocutors[interlocutorid]) {
      fetch(link("/api/data/person?id=" + encodeURI(interlocutorid)))
        .then((res) => res.json())
        .then((data) => {
          setInterlocutors((interlocutors) => ({
            [data.id]: data,
            ...interlocutors,
          }));
        });
    }
    setChats((c) => {
      const { [interlocutorid]: chat, ...datas } = c;
      return {
        [interlocutorid]: [...(chat || []), data],
        ...datas,
      };
    });
  };

  const setStatusChat = (data: ChangeChatStatusPayload) =>
    setChats((datas) => {
      const ch = { ...datas };
      ch[data.interlocutor] = ch[data.interlocutor] ?? [];
      const i = ch[data.interlocutor].findIndex((c) => c.id == data.chat);
      if (ch[data.interlocutor][i]) {
        ch[data.interlocutor][i] = {
          ...ch[data.interlocutor][i],
          status: data.status,
        };
        ch[data.interlocutor] = [...ch[data.interlocutor]];
        return ch;
      }
      return datas;
    });

  const handleStatusOnline: SocketEventMap["status-online"] = (data) => {
    setInterlocutors((datas) => {
      if (datas[data.id]) {
        return {
          ...datas,
          [data.id]: {
            ...datas[data.id],
            isOnline: data.isOnline,
            lastSeen: data.lastSeen,
          },
        };
      }

      return datas;
    });
  };

  let ontyping_timeout: NodeJS.Timeout;
  const handleSomeoneTyping: SocketEventMap["typings"] = ({ personid }) => {
    if (ontyping_timeout) clearTimeout(ontyping_timeout);
    setTypings((t) => ({ ...t, [personid]: true }));
    ontyping_timeout = setTimeout(
      () => setTypings((t) => ({ ...t, [personid]: false })),
      800
    );
  };

  const handleReceiveMessage: SocketEventMap["receive-message"] = ({
    data,
  }) => {
    pushChat(data);
    const interlocutor = getInterlocutorIdChat(data, user);
    setTimeout(
      () =>
        chatBox.current?.scrollToBottom(false, () => {
          socket.changeStatusMessage({
            chat: data.id,
            interlocutor,
            status: "read",
          });
          setStatusChat({ interlocutor, chat: data.id, status: "read" });
        }),
      100
    );
  };

  const handleStatusMessage: SocketEventMap["status-message"] = (data) => {
    setStatusChat(data);
  };

  const socket = useSocket(user, {
    handleStatusOnline,
    handleSomeoneTyping,
    handleReceiveMessage,
    handleStatusMessage,
  });

  const selectPerson = (person: Person) => {
    setSelected(person.id);
    hideLeftPanel();
  };

  const onStartChat = (person: Person) => {
    setInterlocutors((inter) => ({ [person.id]: person, ...inter }));
    selectPerson(person);
    setModalAdd(false);
  };

  const onReadAllMessage = (interlocutor: Person["id"]) => {
    socket.readAllMessages({
      interlocutor,
      status: "read",
      chats: "all",
    });
    setChats((datas) => {
      const ch = { ...datas };
      ch[interlocutor] =
        ch[interlocutor]?.map((c) => {
          return {
            ...c,
            status: c.from.id == interlocutor ? "read" : c.status,
          };
        }) ?? [];

      return ch;
    });
  };

  const onTyping: OnChatTyping = (personid) => {
    socket.typing({ personid });
  };

  const onSubmit: OnChatSubmit = (text) => {
    const interlocutor = interlocutors[selected!];
    const data: Chat = {
      id: ulid(),
      to: interlocutor,
      from: authToPerson(user!),
      text,
      date: new Date(Date.now()).toISOString(),
      status: "send",
    };
    pushChat(data);
    setTimeout(() => chatBox.current?.scrollToBottom(true), 50);
    socket.sendMessage({ data }, () => {
      setStatusChat({
        interlocutor: interlocutors[selected!].id,
        chat: data.id,
        status: "sent",
      });
    });
  };

  const hideLeftPanel = () =>
    document.querySelector(".leftpanel")?.classList.remove("show");

  useEffect(() => {
    fetch(link("/api/data/chat-all"))
      .then((res) => res.json())
      .then(({ chats, interlocutors }) => {
        setChats(chats);
        setInterlocutors(interlocutors);
      });
  }, []);

  return (
    <div className="m-auto max-w-5xl h-screen md:h-[90vh] min-h-[700px] w-full bg-white md:rounded-3xl shadow-xl overflow-hidden">
      <div className="flex h-full relative">
        <div className="leftpanel absolute md:relative md:w-1/3 transition-all duration-200 ease-in-out z-20">
          <div className="backdrop" onClick={hideLeftPanel}></div>
          <div className="flex flex-col gap-4 bg-white relative z-10 h-screen md:h-[90vh]">
            <Header onAdd={() => setModalAdd(true)} />
            <Search value={search} onChange={setSearch} />
            <div className="flex-1 relative overflow-y-auto">
              <div className="pb-3">
                {interlocutors_filtered.map((person) => (
                  <Person
                    key={person.id}
                    user={person}
                    lastChat={
                      chats[person.id]?.length > 0
                        ? chats[person.id][chats[person.id].length - 1]
                        : undefined
                    }
                    onSelect={() => selectPerson(person)}
                    selected={selected == person.id}
                    unread={
                      chats[person.id]?.filter(
                        (c) => c.from.id == person.id && c.status != "read"
                      ).length
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        <ChatBox
          ref={chatBox}
          user={interlocutors[selected]}
          typing={typings[selected]}
          chats={chats[selected]}
          onTyping={onTyping}
          onSubmit={onSubmit}
          onReadAllMessage={onReadAllMessage}
        />
      </div>
      <ModalNewChat
        show={modalAdd}
        onClose={() => setModalAdd(false)}
        onStartChat={onStartChat}
      />
    </div>
  );
}
