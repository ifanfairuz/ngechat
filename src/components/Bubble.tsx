import { dateToAgo, formatTime, isSameDay } from "@/lib/date";
import Image from "next/image";
import { memo } from "react";
import { BubbleStatus } from "./BubbleStatus";

export const Bubble = memo(
  ({ chat, next, prev, me, firstunread }: BubbleProps) => {
    const diffwithnext = next?.from.id != chat.from.id;
    const diffwithprev = prev?.from.id != chat.from.id;

    return (
      <>
        {(!prev || !isSameDay(chat.date, prev.date)) && (
          <div className="p-2">
            <div className="flex justify-center">
              <div className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-lg">
                {dateToAgo(chat.date)}
              </div>
            </div>
          </div>
        )}
        {firstunread && (
          <div className="p-2" data-label="unread-label">
            <div className="flex justify-center">
              <div className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-lg">
                Unread Messages
              </div>
            </div>
          </div>
        )}
        <div className="px-2">
          <div
            className={`flex items-end gap-2 px-2 ${
              diffwithnext ? "pb-2" : "pb-0.5"
            }`}
          >
            {!me && diffwithnext ? (
              <Image
                src={chat.from.imageUri}
                alt="avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
            ) : (
              <div className="w-[30px]" />
            )}
            <div className={`flex-1 flex ${me ? "justify-end" : ""}`}>
              <div
                className={`min-w-[60px] max-w-[90%] bubble ${
                  diffwithprev ? "diffprev" : ""
                } ${diffwithnext ? "tail diffnext" : ""} ${me ? "me" : ""}`}
              >
                <p className="text-sm whitespace-pre-line">{chat.text}</p>
                <div className="-mb-0.5 -mr-0.5 flex gap-1 justify-end items-center">
                  <p className="text-xs text-right opacity-40 leading-none">
                    {formatTime(chat.date)}
                  </p>
                  {me && <BubbleStatus status={chat.status} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
  (p, n) =>
    p.chat.id == n.chat.id &&
    p.chat.status == n.chat.status &&
    p.prev?.id == n.prev?.id &&
    p.next?.id == n.next?.id &&
    p.me == n.me
);
Bubble.displayName = "Bubble";
