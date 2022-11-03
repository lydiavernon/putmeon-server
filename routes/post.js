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

module.exports = router;
