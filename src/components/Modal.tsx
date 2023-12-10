export const Modal = ({
  show,
  children,
  header,
  head,
  onClose,
}: ModalProps) => {
  if (!show) return null;

  return (
    <div className="absolute h-screen w-screen top-0 left-0 flex items-center justify-center z-30">
      <div
        className="absolute h-screen w-screen bg-black bg-opacity-40"
        onClick={onClose}
      ></div>
      <div className="relative bg-white max-w-lg w-full max-h-xl min-h-[80vh] mx-auto z-20 rounded-lg shadow-lg flex flex-col">
        <div className="p-2 flex items-center justify-between">
          <h4 className="p-2 text-xl font-medium">{header}</h4>
          <button className="p-2" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
              />
            </svg>
          </button>
        </div>
        {head}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
