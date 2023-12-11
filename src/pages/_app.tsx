import { f_variable } from "@/lib/font";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main
      className={
        "flex md:h-screen h-[88vh] flex-col items-center justify-between font-base " +
        f_variable
      }
    >
      <Component {...pageProps} />
    </main>
  );
}
