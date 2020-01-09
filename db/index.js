const pgp = require("pg-promise")({});

const connection = {
  host: process.env.HOST || "localhost",
  port: 5432,
  database: process.env.DB || "reviews",
  user: process.env.USER || "uncreative",
  password: process.env.PASSWORD || null
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
