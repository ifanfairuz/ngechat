import {
  ChangeEventHandler,
  KeyboardEventHandler,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export const ChatForm = forwardRef<ChatFormElement, ChatFormProps>(
  ({ onTyping, onSubmit }, ref) => {
    const input = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState("");
    const row = useMemo(() => Math.min(text.split("\n").length, 4), [text]);
    const submit = () => {
      if (text != "") {
        onSubmit(text.trim());
        setText("");
      }
    };

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      setText(e.target.value);
    };
    const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
      if (e.code == "Enter" && !e.shiftKey) {
        e.stopPropagation();
        e.preventDefault();
        submit();
        return;
      }
      onTyping();
    };

    useImperativeHandle(ref, () => ({
      focus() {
        input.current?.focus();
      },
    }));

    useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.code == "Space" && input.current !== document.activeElement) {
          e.preventDefault();
          e.stopPropagation();
          input.current?.focus();
        }
      };
      document.addEventListener("keyup", handler);

      return () => {
        document.removeEventListener("keyup", handler);
      };
    }, []);

    return (
      <div className="flex items-end px-4 pt-4 pb-6 gap-4">
        <div className="flex-1 bg-white rounded-3xl py-2 px-2 shadow">
          <textarea
            ref={input}
            value={text}
            onChange={onChange}
            onKeyDown={onKeyDown}
            rows={row}
            placeholder="Type message here ..."
            className="block px-3 py-1 w-full outline-none resize-none"
          ></textarea>
        </div>
        <button
          className="p-3 rounded-full bg-green-400 shadow"
          onClick={submit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m5 12l-.604-5.437C4.223 5.007 5.825 3.864 7.24 4.535l11.944 5.658c1.525.722 1.525 2.892 0 3.614L7.24 19.466c-1.415.67-3.017-.472-2.844-2.028zm0 0h7"
            />
          </svg>
        </button>
      </div>
    );
  }
);
ChatForm.displayName = "ChatForm";
