import {
  RxCollection,
  RxDatabase,
  RxJsonSchema,
  addRxPlugin,
  createRxDatabase,
} from "rxdb";
import { getRxStorageMemory } from "rxdb/plugins/storage-memory";
import { RxDBMigrationPlugin } from "rxdb/plugins/migration";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBUpdatePlugin } from "rxdb/plugins/update";
import { getRxStorageMongoDB } from "rxdb/plugins/storage-mongodb";

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);

interface DBCollections {
  persons: RxCollection<Person>;
  chats: RxCollection<ChatDB>;
}

let db: RxDatabase<DBCollections>;

const personSchema: RxJsonSchema<Person> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    imageUri: {
      type: "string",
    },
    lastSeen: {
      type: "string",
    },
    isOnline: {
      type: "boolean",
      default: false,
    },
  },
  required: ["id", "name", "imageUri", "lastSeen"],
};

const chatSchema: RxJsonSchema<
  Omit<Chat, "to" | "from"> & { to: string; from: string }
> = {
  version: 0,
  primaryKey: "id",
  type: "object",
  properties: {
    id: {
      type: "string",
      maxLength: 100,
    },
    to: {
      type: "string",
      ref: "persons",
    },
    from: {
      type: "string",
      ref: "persons",
    },
    text: {
      type: "string",
    },
    date: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },
  required: ["id", "to", "from", "text", "date", "status"],
};

const getStorage = () => {
  const driver = process.env.DB_DRIVER || "memory";
  if (driver == "mongodb") {
    return getRxStorageMongoDB({
      connection: process.env.DB_CONNECTION || "mongodb://localhost:27017",
    });
  }

  return getRxStorageMemory();
};

export const init = async () => {
  if (!db) {
    db = await createRxDatabase<DBCollections>({
      name: "chat-db",
      storage: getStorage(),
      ignoreDuplicate: true,
    });
  }

  if (!db.collections.persons) {
    await db.addCollections({
      persons: {
        schema: personSchema,
      },
    });
  }

  if (!db.collections.chats) {
    await db.addCollections({
      chats: {
        schema: chatSchema,
      },
    });
  }

  return db;
};
