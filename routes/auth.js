const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile.js").development);
const passport = require("passport");

require("dotenv").config();

// Logs in via spotify
router.get(
  "/spotify",
  passport.authenticate("spotify", {
    scope: [
      "user-read-recently-played",
      "user-read-email",
      "user-read-private",
      "playlist-modify-private",
    ],
    showDialog: true,
  })
);

// What to do once we get back after the user clicks allow
router.get(
  "/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
  }),
  function (req, res) {
    res.redirect(`${process.env.CLIENT_URL}/`);
  }
);

// Allows the frontend to get the user data
router.get("/profile", (req, res) => {
  if (req.user === undefined)
    return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json(req.user);
});

// Allows the frontend to create a new user in the DB
router.post("/profile/create", (req, res) => {
  knex("users")
    .select("id")
    .where({ spotify_user_id: req.body.spotify_user_id })
    .then((user) => {
      if (user.length) {
        return res.status(200).json({ message: "User already exists" });
      } else {
        knex("users")
          .insert(req.body)
          .then((userId) => {
            return res.status(200).json({ message: "User created" });
          })
          .catch((err) => {
            console.log("error creating a user", err);
          });
      }
    })
    .catch((err) => {
      console.log("Error fetching a user", err);
    });
});

router.get("/logout", function (req, res) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.redirect(`${process.env.CLIENT_URL}/`);
  });
});

module.exports = router;
