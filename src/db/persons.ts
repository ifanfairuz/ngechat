import { MangoQuery } from "rxdb";
import { init } from "./db";

export const addPerson = async (person: Person) => {
  const db = await init();
  return await db.persons.upsert(person);
};

export const getPerson = async (id: Person["id"]) => {
  const db = await init();
  return await db.persons.findOne({ selector: { id: { $eq: id } } }).exec();
};

export const allPerson = async (q?: MangoQuery<Person>) => {
  const db = await init();
  return await db.persons.find(q).exec();
};

export const setOnline = async (
  id: string,
  isOnline: boolean,
  lastSeen?: number
) => {
  const db = await init();
  const update: Partial<Person> = { isOnline };
  if (lastSeen) update.lastSeen = lastSeen;
  return await db.persons.findOne().where("id").eq(id).update({
    $set: update,
  });
};
