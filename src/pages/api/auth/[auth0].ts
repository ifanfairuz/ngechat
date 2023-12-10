import {
  handleAuth,
  HandleCallback,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { addPerson } from "@/db/persons";
import { getPerson } from "@/lib/session";

const callback: HandleCallback = (async (req, res, options) => {
  const person = await getPerson(req, res);
  if (person) addPerson(person);
  return await handleCallback(req, res, options);
}) as HandleCallback;

export default handleAuth({
  callback,
});
