const pgp = require("pg-promise")({});
const connection = {
  host: "db",
  port: 5432,
  database: process.env.DB || "reviews",
  user: process.env.USER || "postgres",
  password: process.env.PASSWORD || "postgres"
};

let db = pgp(connection);

db.connect()
  .then(obj => {
    console.log("Connected to database!");
    obj.done();
  })
  .catch(error => {
    console.log(`Error: ${error}`);
  });

module.exports = db;
