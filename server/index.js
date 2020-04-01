const express = require("express");
const parser = require("body-parser");
const router = require("./routes.js");

const app = express();

const PORT = process.env.SERVER_PORT || 3003;

// Logger for development purposes

// const logger = require("morgan");
// app.use(logger("dev"));

app.use(parser.json());
app.use("/", router);

console.log(process.env.LOADER);

app.listen(PORT, () => console.log(`Connected on PORT: ${PORT}`));
