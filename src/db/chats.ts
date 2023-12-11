import { statusCanChangeWith } from "@/lib/data";
import { Connection } from "mysql";
import { runQuery } from "./db";

interface JoinedPerson {
  to_id: string;
  to_name: string;
  to_imageUri: string;
  to_lastSeen?: string;
  to_isOnline: boolean;
  from_id: string;
  from_name: string;
  from_imageUri: string;
  from_lastSeen?: string;
  from_isOnline: boolean;
}

const populateJoinedTo = (data: Chat & JoinedPerson) => {
  return {
    id: data.to_id,
    name: data.to_name,
    imageUri: data.to_imageUri,
    lastSeen: data.to_lastSeen,
    isOnline: data.to_isOnline,
  } as Person;
};
const populateJoinedFrom = (data: Chat & JoinedPerson) => {
  return {
    id: data.from_id,
    name: data.from_name,
    imageUri: data.from_imageUri,
    lastSeen: data.from_lastSeen,
    isOnline: data.from_isOnline,
  } as Person;
};
const populateJoinedToChat = (data: Chat & JoinedPerson) => {
  return {
    id: data.id,
    to: populateJoinedTo(data),
    from: populateJoinedFrom(data),
    text: data.text,
    date: data.date,
    status: data.status,
  } as Chat;
};

const dbname = "chats";
const tablesname = "(id, `to`, `from`, `text`, `date`, status)";

export const insertChat = (con: Connection, data: Chat) => {
  const sql = `INSERT INTO ${dbname}${tablesname} VALUES (?, ?, ?, ?, ?, ?)`;
  return runQuery(con, sql, [
    data.id,
    data.to.id,
    data.from.id,
    data.text,
    data.date,
    data.status,
  ]).then(() => data);
};

export const getAllChat = async (con: Connection, user: Auth0User) => {
  const sql = `SELECT
  ${dbname}.id, ${dbname}.\`text\`, ${dbname}.\`date\`, ${dbname}.status,
  T.id as to_id, T.name as to_name, T.imageUri as to_imageUri, T.lastSeen as to_lastSeen, T.isOnline as to_isOnline,
  F.id as from_id, F.name as from_name, F.imageUri as from_imageUri, F.lastSeen as from_lastSeen, F.isOnline as from_isOnline
  FROM ${dbname}
  LEFT JOIN persons T ON T.id = ${dbname}.\`to\`
  LEFT JOIN persons F ON F.id = ${dbname}.\`from\`
  WHERE \`to\` = ? OR \`from\` = ?`;
  return runQuery<Chat & JoinedPerson>(con, sql, [user.email, user.email]).then(
    ({ results }) => {
      let chats: Chats = {};
      let interlocutors: Persons = {};

      for (const result of results) {
        const chat = populateJoinedToChat(result);
        let id: string;
        if (result.to_id == user.email) {
          id = result.from_id;
          interlocutors[id] = chat.from;
        } else {
          id = result.to_id;
          interlocutors[id] = chat.to;
        }
        chats[id] = chats[id] || [];
        chats[id].push(chat);
      }

      return { chats, interlocutors };
    }
  );
};

export const changeStatus = (
  con: Connection,
  data: ChangeChatStatusPayload
) => {
  const sql = `UPDATE ${dbname} SET status = ? WHERE id = ?`;
  return runQuery(con, sql, [data.status, data.chat]).then(() => true);
};

export const changeAllStatusWith = (
  con: Connection,
  from_id: Person["id"],
  to_id: Person["id"],
  status: ChatStatus
) => {
  const sql_status = statusCanChangeWith(status).join("', '");
  const sql = `SELECT
  ${dbname}.id, ${dbname}.\`text\`, ${dbname}.\`date\`, ${dbname}.status,
  T.id as to_id, T.name as to_name, T.imageUri as to_imageUri, T.lastSeen as to_lastSeen, T.isOnline as to_isOnline,
  F.id as from_id, F.name as from_name, F.imageUri as from_imageUri, F.lastSeen as from_lastSeen, F.isOnline as from_isOnline
  FROM ${dbname}
  LEFT JOIN persons T ON T.id = ${dbname}.\`to\`
  LEFT JOIN persons F ON F.id = ${dbname}.\`from\`
  WHERE \`to\` = ? AND \`from\` = ? AND \`status\` IN ('${sql_status}')`;
  return runQuery<Chat & JoinedPerson>(con, sql, [to_id, from_id]).then(
    ({ results }) => {
      if (results && results.length > 0) {
        const sql_ids = `'${results.map((c) => c.id).join("', '")}'`;
        const sql = `UPDATE ${dbname} SET status = ? WHERE id IN (${sql_ids})`;
        return runQuery(con, sql, [status]).then(() =>
          results.map(populateJoinedToChat)
        );
      }
      return [];
    }
  );
};

export const changeAllStatuses = async (
  con: Connection,
  chat_ids: Chat["id"][],
  status: ChatStatus
) => {
  const sql_status = statusCanChangeWith(status).join("', '");
  const sql = `SELECT
  ${dbname}.id, ${dbname}.\`text\`, ${dbname}.\`date\`, ${dbname}.status,
  T.id as to_id, T.name as to_name, T.imageUri as to_imageUri, T.lastSeen as to_lastSeen, T.isOnline as to_isOnline,
  F.id as from_id, F.name as from_name, F.imageUri as from_imageUri, F.lastSeen as from_lastSeen, F.isOnline as from_isOnline
  FROM ${dbname}
  LEFT JOIN persons T ON T.id = ${dbname}.\`to\`
  LEFT JOIN persons F ON F.id = ${dbname}.\`from\`
  WHERE id IN ? AND status IN ('${sql_status}')`;
  return runQuery<Chat & JoinedPerson>(con, sql, [chat_ids]).then(
    ({ results }) => {
      if (results && results.length > 0) {
        const sql_ids = `'${results.map((c) => c.id).join("', '")}'`;
        const sql = `UPDATE ${dbname} SET status = ? WHERE id IN (${sql_ids})`;
        return runQuery(con, sql, [status]).then(() =>
          results.map(populateJoinedToChat)
        );
      }
      return [];
    }
  );
};
