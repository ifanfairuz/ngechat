export const ButtonToggleLeftPanel = () => {
  const toggleLeftPanel = () => {
    document.querySelector(".leftpanel")?.classList.toggle("show");
  };

  return (
    <button
      onClick={toggleLeftPanel}
      className="p-2 hover:bg-slate-200 rounded md:hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M3 16h18v2H3v-2Zm0-5h18v2H3v-2Zm0-5h18v2H3V6Z"
        />
      </svg>
    </button>
  );
};
