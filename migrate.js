const { parse } = require("dotenv");
const { readFileSync, existsSync } = require("fs");
const { createConnection } = require("mysql");
const path = require("path");

const loadEnv = () => {
  const { NODE_ENV } = process.env;
  const envs = [
    `.env`,
    `.env.${NODE_ENV}`,
    `.env.local`,
    `.env.${NODE_ENV}.local`,
  ];

  let config = {};
  for (const env of envs) {
    if (existsSync(env)) {
      const buf = readFileSync(env);
      config = { ...config, ...parse(buf) };
    }
  }

  return config;
};

const query = (con, sql, values = undefined) =>
  new Promise((resolve, reject) => {
    const callback = (err, results, fields) => {
      if (err) return reject(err);

      resolve({ results, fields });
    };
    con.query(sql, values, callback);
  });

const migrate = async () => {
  const config = loadEnv();
  const con = createConnection({
    host: config.DB_HOST || "localhost",
    user: config.DB_USER || "root",
    password: config.DB_PASS || "",
    database: config.DB_NAME || "next-chat",
    port: parseInt(config.DB_PORT || "3306"),
    multipleStatements: true,
  });

  const sql = readFileSync(path.join(__dirname, "migration.sql"))
    .toString("utf-8")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\r\n|\r|\n/g, "");

  con.beginTransaction((err) => {
    if (err) throw err;

    const rollbackIfError = (err) => {
      if (err) {
        con.rollback((err) => {
          if (err) {
            con.end();
            console.log("rollback error.");
            throw err;
          } else {
            console.log("rollback migrate.");
            con.end();
          }
        });
      } else {
        con.end();
        console.log("done migrate.");
      }
    };

    query(con, sql)
      .then(() => con.commit(rollbackIfError))
      .catch(rollbackIfError);
  });
};

migrate();
