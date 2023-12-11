import { Connection } from "mysql";
import { runQuery } from "./db";

const dbname = "persons";
const tablesname = "(id, name, imageUri, lastSeen, isOnline)";

export const insertIgnorePerson = (con: Connection, person: Person) => {
  const sql = `INSERT IGNORE INTO ${dbname}${tablesname} VALUES (?, ?, ?, ?, ?)`;
  return runQuery(con, sql, [
    person.id,
    person.name,
    person.imageUri,
    person.lastSeen,
    person.isOnline,
  ]).then(() => true);
};

export const upsertPerson = (con: Connection, person: Person) => {
  const sql = `REPLACE INTO ${dbname}${tablesname} VALUES (?, ?, ?, ?, ?)`;
  return runQuery(con, sql, [
    person.id,
    person.name,
    person.imageUri,
    person.lastSeen,
    person.isOnline,
  ]).then(() => true);
};

export const getPerson = (con: Connection, id: Person["id"]) => {
  const sql = `SELECT * FROM ${dbname} WHERE id = ? LIMIT 1`;
  return runQuery(con, sql, [id]).then(({ results }) =>
    results && results.length > 0 ? (results[0] as Person) : undefined
  );
};

export const allPerson = (con: Connection) => {
  const sql = `SELECT * FROM ${dbname}`;
  return runQuery(con, sql).then(({ results }) => results as Person[]);
};

export const allPersonExcept = (con: Connection, id: Person["id"]) => {
  const sql = `SELECT * FROM ${dbname} WHERE id != ?`;
  return runQuery(con, sql, [id]).then(({ results }) => results as Person[]);
};

export const setOnline = (
  con: Connection,
  id: string,
  isOnline: boolean,
  lastSeen?: string
) => {
  let values: any[] = [isOnline];
  let sql = `UPDATE ${dbname} SET isOnline = ? `;
  if (lastSeen) {
    sql += ", lastSeen = ? ";
    values.push(lastSeen);
  }
  sql += "WHERE id = ?";
  values.push(id);

  return runQuery(con, sql, values).then(() => true);
};
