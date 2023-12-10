import { dateToAgo, lastSeen } from "@/lib/date";
import Image from "next/image";
import { memo } from "react";

export const Person = memo(
  ({ user, lastChat, selected, unread, onSelect }: PersonProps) => {
    return (
      <div className="px-1">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 hover:shadow cursor-pointer ${
            selected ? "bg-slate-100" : ""
          }`}
          onClick={() => onSelect && onSelect()}
        >
          <Image
            src={user.imageUri}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full shadow-md"
          />
          <div className="flex-1 flex flex-col">
            <div className="grid grid-cols-3 items-center">
              <p className="truncate col-span-2">
                {user.name.split("@").shift()}
              </p>
              <p className="text-xs opacity-40 text-right col-span-1">
                {lastChat ? dateToAgo(lastChat.date, true) : ""}
              </p>
            </div>
            <div className="grid grid-cols-6 gap-1">
              <p className="text-sm truncate col-span-5 opacity-40">
                {lastChat
                  ? lastChat.text
                  : user.isOnline
                  ? "Online"
                  : user.lastSeen
                  ? lastSeen(user.lastSeen)
                  : ""}
              </p>
              {!!unread && unread > 0 && (
                <div className="flex items-center justify-end">
                  <div className="p-1 min-w-[18px] text-center text-2xs bg-green-400 rounded-full">
                    <p className="opacity-60">{unread}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
  (p, n) =>
    p.user.id == n.user.id &&
    p.lastChat?.id == n.lastChat?.id &&
    p.selected == n.selected &&
    p.unread == n.unread
);
Person.displayName = "Person";
