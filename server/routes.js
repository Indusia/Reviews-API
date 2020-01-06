const router = require("express").Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.any("SELECT * FROM reviews")
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
});

module.exports = router;
