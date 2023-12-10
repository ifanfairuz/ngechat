import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="m-auto max-w-2xl h-[60vh] min-h-[500px] w-full bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="flex flex-col text-center justify-center gap-4 h-full py-8">
        <div className="flex flex-col mb-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-8 h-8 mx-auto opacity-50"
          >
            <g fill="none">
              <path
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M9.882 15C13.261 15 16 12.538 16 9.5S13.261 4 9.882 4C6.504 4 3.765 6.462 3.765 9.5c0 .818.198 1.594.554 2.292L3 15l3.824-.736A6.62 6.62 0 0 0 9.882 15Z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
                d="M10.804 18.124a6.593 6.593 0 0 0 3.314.876a6.623 6.623 0 0 0 3.059-.736L21 19l-1.32-3.208a5.02 5.02 0 0 0 .555-2.292c0-1.245-.46-2.393-1.235-3.315c-.749-.89-1.792-1.569-3-1.92"
              />
              <circle
                r="1"
                fill="currentColor"
                transform="matrix(-1 0 0 1 13 9.5)"
              />
              <circle
                r="1"
                fill="currentColor"
                transform="matrix(-1 0 0 1 10 9.5)"
              />
              <circle
                r="1"
                fill="currentColor"
                transform="matrix(-1 0 0 1 7 9.5)"
              />
            </g>
          </svg>
          <h3 className="text-2xl opacity-50 font-title -mt-1.5">Ngechat</h3>
        </div>
        <div className="flex flex-col gap-2 -mt-8 mb-auto">
          <h1 className="text-6xl opacity-50 font-bold">404</h1>
          <p className="text-2xl opacity-50 mb-6">Not Found</p>
          <Link
            href="/"
            className="mx-auto px-4 py-2 rounded-full bg-green-400 outline-none shadowLg text-green-700 hover:bg-green-500"
          >
            Back to Home
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <p className="opacity-40">follow me on:</p>
          <div className="flex gap-2 justify-center">
            <Link
              href="https://github.com/ifanfairuz"
              target="_blank"
              className="opacity-70 hover:opacity-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8"
              >
                <path
                  fill="currentColor"
                  d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"
                />
              </svg>
            </Link>
            <Link
              href="https://www.linkedin.com/in/ifan-fairuz-4659611a0"
              target="_blank"
              className="opacity-70 hover:opacity-100 hover:text-[#0077b5]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-8 h-8"
              >
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Custom404;
