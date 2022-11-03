const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);

router.post("/", async (req, res) => {
  const body = req.body;

  const result = await knex("users")
    .select("id")
    .where({ spotify_user_id: body.user_spotify_id });

  const userId = result[0].id;

  await knex("posts").insert({
    user_id: userId,
    song_id: body.song_id,
    comment: body.comment,
  });

  //send a response json, with new post
  res.status(201).json({ message: "done" });
});

router.get("/", async (req, res) => {
  const posts = await knex("posts")
    .options({ nestTables: true })
    .join("users", "posts.user_id", "=", "users.id")
    .orderBy("created_at", "desc")
    .select();

  res.status(200).json(posts);
});

module.exports = router;
