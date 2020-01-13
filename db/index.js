// Connect to the database using pg-promise

const pgp = require("pg-promise")({});

const connection = {
  host: process.env.HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB || "reviews",
  user: process.env.USER || "david",
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

module.exports.db = db;

// Connect to the database using pg-pool

const Pool = require("pg-pool");

const pool = new Pool({
  host: process.env.HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB || "reviews",
  user: process.env.USER || "david",
  password: process.env.PASSWORD || null,
  max: 30,
  idleTimeoutMillis: 1000,
  connectionTimeoutMillis: 3000
});

module.exports.pool = pool;
