const express = require("express");
const db = require("../data/dbConfig.js");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ api: "running" });
});

server.get("/api/accounts", (req, res) => {
  db("accounts")
    .then((accounts) => res.status(200).json({ data: accounts }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

server.get("/api/accounts/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .first()
    .then((account) => res.status(200).json({ account: account }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err.message });
    });
});

server.post("/api/accounts", (req, res) => {
  const newAccount = req.body;
  db("accounts")
    .insert(newAccount, "id")
    .then((ids) => {
      const id = ids[0];
      db("accounts")
        .where({ id })
        .first()
        .then((account) => {
          res.status(200).json({ data: account });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

server.put("/api/accounts/:id", (req, res) => {
  const id = req.params.id;
  db("accounts")
    .where({ id })
    .update(req.body)
    .then((count) => {
      if (count) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(404).json({ message: "id not found, failed to update" });
      }
    });
});

server.delete("/api/accounts/:id", (req, res) => {
  const id = req.params.id;
  db("accounts")
    .where({ id })
    .del()
    .then((count) => {
      if (count) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(404).json({ message: "invalid id, cannot delete" });
      }
    });
});

module.exports = server;