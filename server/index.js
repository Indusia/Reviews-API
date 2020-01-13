const express = require("express");
const parser = require("body-parser");
const router = require("./routes.js");
// const logger = require("morgan");

const app = express();

const PORT = process.env.SERVER_PORT || 3003;

// app.use(logger("dev"));
app.use(parser.json());
app.use("/", router);

app.listen(PORT, () => console.log(`Connected on PORT: ${PORT}`));
