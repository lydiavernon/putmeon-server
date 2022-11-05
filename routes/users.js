const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);

router.get("/:spotify_user_id", async (req, res) => {
  const { spotify_user_id } = req.params;
  const results = await knex("users")
    .select("*")
    .where({ spotify_user_id: spotify_user_id });

  res.json(results);
});

router.put("/:spotify_user_id", async (req, res) => {
  const { spotify_user_id } = req.params;
  await knex("users")
    .where({ spotify_user_id: spotify_user_id })
    .update({ is_verified: true });
  res.status(200).json({ message: "done" });
});

module.exports = router;
