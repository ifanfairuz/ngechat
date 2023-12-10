import { getSession as getSessionAuth0 } from "@auth0/nextjs-auth0/edge";
import { sessionToPerson } from "./data";

export const getSession: GetSession = (...args) =>
  getSessionAuth0(...args) as Promise<Auth0Session | null | undefined>;

export const getPerson = async (...args: GetSession["arguments"]) => {
  const session = await getSession(...args);
  return sessionToPerson(session || undefined);
};
