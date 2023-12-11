import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Bubble } from "./Bubble";
import { ChatForm } from "./ChatForm";
import { PersonHeader } from "./PersonHeader";
import { ButtonToggleLeftPanel } from "./ButtonToggleLeftPanel";

const SCROLL_MIN_DIFF = 100;
const isScrolledTop = (el: HTMLDivElement) =>
  el.scrollHeight - el.scrollTop - el.clientHeight >= SCROLL_MIN_DIFF;

export const ChatBox = memo(
  forwardRef<ChatBoxElement, ChatBoxProps>(
    ({ chats, user, typing, onTyping, onSubmit, onReadAllMessage }, ref) => {
      const scroll = useRef<HTMLDivElement>(null);
      const form = useRef<ChatFormElement>(null);
      let unreadid = useRef<string | null>(null);

      const unreadmessages = useMemo(
        () =>
          chats?.filter((c) => c.from.id == user?.id && c.status != "read")
            .length ?? 0,
        [chats, user]
      );

      const setUnredId = (id: string | null) => {
        unreadid.current = id;
        return !!id;
      };

      const onSubmitChat: OnChatSubmit = (text) => {
        onSubmit(text);
      };

      const scrollToBottom = (
        behavior: ScrollOptions["behavior"] = "instant"
      ) => {
        scroll.current?.scrollTo({
          top: scroll.current?.scrollHeight,
          behavior,
        });
      };

      const scrollIfSelected = useCallback<ChatBoxElement["scrollIfSelected"]>(
        (id, onScrolled) => {
          if (!scroll.current) return;
          if (user?.id == id && !isScrolledTop(scroll.current)) {
            setTimeout(() => {
              scrollToBottom();
              onScrolled && onScrolled();
            }, 100);
          }
        },
        [user]
      );

      useImperativeHandle(
        ref,
        () => ({
          focus: () => form.current?.focus(),
          scrollToBottom: (force, onScrolled) => {
            if (!scroll.current) return;
            if (force || !isScrolledTop(scroll.current)) {
              setTimeout(() => {
                scrollToBottom();
                onScrolled && onScrolled();
              }, 100);
            }
          },
          scrollIfSelected,
        }),
        [scrollIfSelected]
      );

      useEffect(() => {
        setUnredId(null);
        if (!user) return;

        if (scroll.current) scroll.current.onscroll = () => {};

        const unreadlabel = document.querySelector(
          '[data-label="unread-label"]'
        );
        if (unreadlabel) {
          unreadlabel.scrollIntoView({ block: "nearest" });
        } else {
          scrollToBottom();
          form.current?.focus();
          unreadmessages > 0 && onReadAllMessage && onReadAllMessage(user.id);
        }

        if (scroll.current) {
          let timeout: NodeJS.Timeout;
          scroll.current.onscroll = (e) => {
            if (isScrolledTop(scroll.current!)) {
              document
                .querySelector("#scroll-to-bottom-box.hidden")
                ?.classList.remove("hidden");
            } else {
              if (timeout) clearTimeout(timeout);
              document
                .querySelector("#scroll-to-bottom-box:not(.hidden)")
                ?.classList.add("hidden");
              timeout = setTimeout(() => {
                unreadmessages > 0 &&
                  onReadAllMessage &&
                  onReadAllMessage(user.id);
              }, 1000);
            }
          };
        }
      }, [user]);

      if (!user) {
        return (
          <div className="w-full flex flex-col">
            <div className="px-4 py-3 bg-white shadow-lg md:hidden">
              <div className="flex items-center gap-4 h-[55px]">
                <ButtonToggleLeftPanel />
                <h3 className="text-2xl font-medium font-title">Ngechat</h3>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-stone-100 text-stone-400">
              <h5 className="text-6xl mb-4 font-title">Ngechat</h5>
              <p className="text-center px-2 border-gray-300">
                Start chat with user on left panel or <br />
                click button plus on left panel.
              </p>
            </div>
          </div>
        );
      }

      return (
        <div className="w-full flex flex-col bg-stone-100 relative z-10">
          <PersonHeader user={user} typing={typing} />
          <div ref={scroll} className="flex-1 shadow-inner overflow-y-auto">
            <div className="pb-2 pt-4">
              {chats?.map((v, i) => {
                const me = v.to.id == user.id;
                return (
                  <Bubble
                    key={i}
                    chat={v}
                    me={me}
                    prev={chats[i - 1]}
                    next={chats[i + 1]}
                    firstunread={
                      unreadid.current == v.id
                        ? true
                        : !unreadid.current && !me && v.status != "read"
                        ? setUnredId(v.id)
                        : false
                    }
                  />
                );
              })}
            </div>
          </div>
          <ChatForm
            ref={form}
            onTyping={() => onTyping(user.id)}
            onSubmit={onSubmitChat}
          />
          <div
            className="absolute right-2 md:right-4 bottom-28 hidden flex flex-col items-center justify-center gap-2"
            id="scroll-to-bottom-box"
          >
            {unreadmessages > 0 && (
              <div className="absolute top-[-10px] right-[-5px] w-[20px] h-[20px] bg-green-400 rounded-full shadow-xl text-center text-xs flex items-center justify-center">
                {unreadmessages}
              </div>
            )}
            <button
              className="p-2 bg-white rounded-full shadow-xl"
              onClick={() => scrollToBottom("smooth")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      );
    }
  ),
  (p, n) =>
    p.user?.id == n.user?.id &&
    p.user?.isOnline == n.user?.isOnline &&
    p.chats == n.chats &&
    p.typing == n.typing
);
