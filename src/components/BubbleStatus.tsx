import { memo } from "react";

const receivedRead = () => (
  <path
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    d="m8 12.485l4.243 4.243l8.484-8.485M3 12.485l4.243 4.243m8.485-8.485L12.5 11.5"
  />
);

const content: Record<ChatStatus, () => React.JSX.Element> = {
  send: () => (
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M11 8v5h5" />
    </g>
  ),
  sent: () => (
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M20 7L10 17l-5-5"
    />
  ),
  received: receivedRead,
  read: receivedRead,
};

export const BubbleStatus = memo(
  ({ status }: BubbleStatusProps) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        className={`${status == "read" ? "text-blue-600" : "opacity-40"}`}
      >
        {content[status]()}
      </svg>
    );
  },
  (p, n) => p.status == n.status
);
BubbleStatus.displayName = "BubbleStatus";
