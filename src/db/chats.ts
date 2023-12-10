import { statusCanChangeWith } from "@/lib/data";
import { init } from "./db";

export const pushChat = async (data: Chat) => {
  const db = await init();
  const doc = await db.chats.insert({
    id: data.id,
    to: data.to.id,
    from: data.from.id,
    text: data.text,
    date: data.date,
    status: data.status,
  });

  return await (async () =>
    ({
      id: doc.id,
      to: (await doc.populate("to")) as Person,
      from: (await doc.populate("from")) as Person,
      text: doc.text,
      date: doc.date,
    } as Chat))();
};

export const getAllChat = async (user: Auth0User) => {
  const db = await init();
  return await db.chats
    .find({
      selector: {
        $or: [{ to: { $eq: user.email } }, { from: { $eq: user.email } }],
      },
    })
    .exec()
    .then(async (docs) => {
      let chats: Chats = {};
      let interlocutors: Persons = {};
      for (const doc of docs) {
        const to = (await doc.populate("to"))._data;
        const from = (await doc.populate("from"))._data;
        let id: string;

        if (doc.to == user.email) {
          id = doc.from;
          interlocutors[id] = from;
        } else {
          id = doc.to;
          interlocutors[id] = to;
        }

        if (!chats[id]) chats[id] = [];
        chats[id].push({
          id: doc.id,
          to,
          from,
          text: doc.text,
          date: doc.date,
          status: doc.status,
        });
      }

      return { chats, interlocutors };
    });
};

export const changeStatus = async (data: ChangeChatStatusPayload) => {
  const db = await init();
  return await db.chats
    .find()
    .where("id")
    .eq(data.chat)
    .update({
      $set: {
        status: data.status,
      },
    });
};

export const changeAllStatusWith = async (
  from_id: Person["id"],
  to_id: Person["id"],
  status: ChatStatus
) => {
  const db = await init();
  return await db.chats
    .find({
      selector: {
        $and: [
          { to: { $eq: to_id } },
          { from: { $eq: from_id } },
          { status: { $in: statusCanChangeWith(status) } },
        ],
      },
    })
    .update({
      $set: {
        status,
      },
    });
};

export const changeAllStatuses = async (
  chat_ids: Chat["id"][],
  status: ChatStatus
) => {
  const db = await init();
  return await db.chats
    .find({
      selector: {
        $and: [
          { id: { $in: chat_ids } },
          { status: { $in: statusCanChangeWith(status) } },
        ],
      },
    })
    .update({
      $set: {
        status,
      },
    });
};
