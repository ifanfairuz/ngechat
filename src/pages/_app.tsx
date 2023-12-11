import { f_variable } from "@/lib/font";
import "@/styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
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
};

export const getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps };
};

export default MyApp;
