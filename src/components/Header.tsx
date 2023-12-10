import Link from "next/link";
import { memo } from "react";

export const Header = memo(
  ({ onAdd }: HeaderProps) => {
    return (
      <div className="flex gap-1 flex-row items-center justify-between px-6 pt-4">
        <h3 className="text-2xl font-medium font-title">Ngechat</h3>
        <div className="flex gap-2">
          <button onClick={onAdd}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 512 512"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M256 112v288m144-144H112"
              />
            </svg>
          </button>
          <Link href="/api/auth/logout">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 3.25a.75.75 0 0 1 0 1.5a7.25 7.25 0 0 0 0 14.5a.75.75 0 0 1 0 1.5a8.75 8.75 0 1 1 0-17.5Z"
              />
              <path
                fill="currentColor"
                d="M16.47 9.53a.75.75 0 0 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H10a.75.75 0 0 1 0-1.5h8.19l-1.72-1.72Z"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  },
  () => true
);
Header.displayName = "Header";
