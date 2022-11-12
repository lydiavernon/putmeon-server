var express = require("express"),
  session = require("express-session"),
  passport = require("passport"),
  SpotifyStrategy = require("passport-spotify").Strategy;

require("dotenv").config();

const PORT = process.env.PORT || 8888;

// When passport saves the user to the session
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

let token = "";

// Sets up passport to work with spotify
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/spotify/callback`,
    },
    // What to do once logged in
    function (accessToken, refreshToken, expires_in, profile, done) {
      token = accessToken;
      return done(null, profile);
    },
    function (error) {
      console.log(error);
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

//passport

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/users");

app.use("/auth", authRoutes);
app.use("/post", postRoutes);
app.use("/users", userRoutes);

app.get("/token", (req, res) => {
  res.json({ token: token });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}.`);
});
