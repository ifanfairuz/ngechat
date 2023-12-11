import { ONE_MINUTE, lastSeen } from "@/lib/date";
import Image from "next/image";
import { memo, useEffect, useState } from "react";
import { ButtonToggleLeftPanel } from "./ButtonToggleLeftPanel";

export const PersonHeader = memo(
  ({ user, typing }: { user: Person; typing?: boolean }) => {
    const [seen, setSeen] = useState("");

    useEffect(() => {
      if (!user.isOnline) {
        setSeen(user.lastSeen ? lastSeen(user.lastSeen) : "");
        const interval = setInterval(
          () => setSeen(user.lastSeen ? lastSeen(user.lastSeen) : ""),
          ONE_MINUTE
        );
        return () => clearInterval(interval);
      }

      setSeen("Online");
    }, [user, user.lastSeen, user.isOnline]);

    return (
      <div className="px-4 py-3 bg-white">
        <div className="flex items-center gap-2">
          <ButtonToggleLeftPanel />
          <Image
            src={user.imageUri}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full mr-2 shadow-md"
          />
          <div className="flex-1 flex flex-col">
            <p className="text-md">{user.name}</p>
            <p className="text-sm opacity-40">{typing ? "Typing..." : seen}</p>
          </div>
        </div>
      </div>
    );
  },
  (p, n) =>
    p.user == n.user &&
    p.user.id == n.user.id &&
    p.user.lastSeen == n.user.lastSeen &&
    p.user.isOnline == n.user.isOnline &&
    p.typing == n.typing
);
PersonHeader.displayName = "PersonHeader";
