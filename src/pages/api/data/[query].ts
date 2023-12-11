import { management } from "@/lib/auth0";
import { getSession } from "@/lib/session";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import * as chats from "@/db/chats";
import * as persons from "@/db/persons";
import { connection } from "@/db/db";

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
  try {
    const db = connection();
    let result = await persons.allPersonExcept(db, req.auth.user?.email || "");

    if (result.length == 0) {
      let datas: Person[] = [];
      const authed_users = await management.users.getAll();
      for (const d of authed_users.data) {
        if (d.email == req.auth.user?.email) continue;
        const personDB = result.find((p) => p.id == d.email);
        const person = {
          id: d.email,
          name: d.name,
          imageUri: d.picture,
          lastSeen:
            personDB?.lastSeen ??
            new Date(d.last_login.toString()).toISOString(),
          isOnline: personDB?.isOnline ?? false,
        } as Person;

        datas.push(person);
        persons.insertIgnorePerson(db, person);
      }
      result = datas;
    }

    db.end();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
}

async function personGet(req: NextApiRequestWithSession, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(404).json({});
  const db = connection();
  const data = await persons.getPerson(db, id as string);
  db.end();
  if (data) {
    res.json(data);
    return;
  }

  res.status(404).json({});
}

async function chatsAll(req: NextApiRequestWithSession, res: NextApiResponse) {
  const db = connection();
  const datas = await chats
    .getAllChat(db, req.auth.user!)
    .finally(() => db.end());
  res.json(datas);
}
