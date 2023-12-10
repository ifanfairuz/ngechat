import { Noto_Sans, Satisfy } from "next/font/google";

const f_base = Noto_Sans({
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-base",
});
const f_title = Satisfy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-title",
  display: "block",
});

export const f_variable = [f_base.variable, f_title.variable].join(" ");
