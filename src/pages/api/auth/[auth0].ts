import {
  handleAuth,
  HandleCallback,
  handleCallback,
} from "@auth0/nextjs-auth0";
import { insertIgnorePerson } from "@/db/persons";
import { getPerson } from "@/lib/session";
import { connection } from "@/db/db";

const callback: HandleCallback = (async (req, res, options) => {
  const person = await getPerson(req, res);
  if (person) {
    const db = connection();
    insertIgnorePerson(db, person).finally(() => db.end());
  }
  return await handleCallback(req, res, options);
}) as HandleCallback;

export default handleAuth({
  callback,
});
