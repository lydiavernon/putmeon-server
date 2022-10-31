var express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy;

require("dotenv").config();

const PORT = process.env.PORT || 8888;

// When passport saves the user to the session
// here's the logic to do at that point (in this case, not much)
passport.serializeUser(function (user, done) {
  done(null, user);
});

// When passport gets the user to the session
// here's the logic to do at that point (in this case, not much)
passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// Sets up passport to work with spotify
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/spotify/callback`,
    },
    // What to do once logged in (in this case, not much)
    function (accessToken, refreshToken, expires_in, profile, done) {
      return done(null, profile);
    }
  )
);

const app = express();

app.use(express.json());

// Sets some important HTTP headers
const helmet = require("helmet");
app.use(helmet());

// Allows frontend to talk to backend with CORS error
const cors = require("cors");
app.use(
  cors({
    origin: true,
    credentials: true, // Allows the user session to travel along with it
  })
);

// Allow the user to be stored in a session cookie
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
