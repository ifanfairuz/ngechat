import { management } from "@/lib/auth0";
import { getSession } from "@/lib/session";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import * as chats from "@/db/chats";
import * as persons from "@/db/persons";

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { query } = req.query;
    const auth = await getSession(req, res);
    if (auth) {
      (req as NextApiRequestWithSession).auth = auth;
    }

    switch (query) {
      case "person-all":
        await personAll(req as NextApiRequestWithSession, res);
        break;

      case "person":
        await personGet(req as NextApiRequestWithSession, res);
        break;

      case "chat-all":
        await chatsAll(req as NextApiRequestWithSession, res);
        break;

      default:
        res.json({});
        break;
    }

    res.status(200).end();
  }
);

async function personAll(req: NextApiRequestWithSession, res: NextApiResponse) {
  const users = management.users.getAll();
  const usersdb = persons.allPerson();

  const [{ data }, datas] = await Promise.all([users, usersdb]);

  let result: Person[] = [];
  for (const d of data) {
    if (d.email == req.auth.user?.email) continue;
    const personDB = datas.find((p) => p.id == d.email);
    const person = {
      id: d.email,
      name: d.name,
      imageUri: d.picture,
      lastSeen:
        personDB?.lastSeen ?? new Date(d.last_login.toString()).getTime(),
      isOnline: personDB?.isOnline ?? false,
    } as Person;

    result.push(person);
    persons.addPerson(person);
  }

  res.json(result);
}

async function personGet(req: NextApiRequestWithSession, res: NextApiResponse) {
  if (
    !("id" in req.query) ||
    !req.query["id"] ||
    typeof req.query["id"] !== "string"
  ) {
    return res.status(404).json({});
  }
  const data = await persons.getPerson(req.query["id"] as string);
  if (data) {
    return res.json(data);
  }

  res.status(404).json({});
}

async function chatsAll(req: NextApiRequestWithSession, res: NextApiResponse) {
  const datas = await chats.getAllChat(req.auth.user!);
  res.json(datas);
}
