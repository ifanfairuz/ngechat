import { Connection, FieldInfo, Query, createConnection } from "mysql";

interface RunQueryResult<R = any> {
  results: R;
  fields?: FieldInfo[];
  query: Query;
}

export const connection = () =>
  createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "next-chat",
    port: parseInt(process.env.DB_PORT || "3306"),
  });

export const runQuery = <T = any>(
  con: Connection,
  sql: string,
  values?: any[]
) => {
  return new Promise<RunQueryResult<T[]>>((resolve, reject) => {
    let results: T[], fields: FieldInfo[] | undefined;
    const query = con.query(sql, values, (err, result, field) => {
      if (err) return reject(err);

      results = result;
      fields = field;
      resolve({ results, fields, query });
    });
  });
};
