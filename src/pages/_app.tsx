import { f_variable } from "@/lib/font";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-between bg-slate-100 font-base " +
        f_variable
      }
    >
      <Component {...pageProps} />
    </main>
  );
}
