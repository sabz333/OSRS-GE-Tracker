import "dotenv/config";
import express from "express";
import session from "express-session";
import mountRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import { errorHandler } from "./middlewares/errorhandlers.js";
import pgS from "connect-pg-simple";
import * as db from "./db/index.js";
import queries from "./db/queries.js";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";

const app = express();
const port = process.env.PORT || 3000;
const pgSession = pgS(session);

app.use(
  session({
    store: new pgSession({
      pool: db.pool,
      tableName: "sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET.split(" "),
    resave: false,
    saveUnitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", express.static("public"));
app.use("/item", express.static("public"));
app.use(passport.initialize());
app.use(passport.session());

mountRoutes(app);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query(queries.findUser, [
          profile.emails[0].value,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(queries.createNewUser, [
            profile.name.givenName,
            profile.name.familyName,
            profile.emails[0].value,
            "google",
          ]);
          const newUserTicker = await db.query(queries.createNewUserTickers, [
            13576,
            18770000,
            1,
            newUser.rows[0].id,
          ]);
          return cb(null, newUser.rows[0]);
        }
        return cb(null, result.rows[0]);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

app.use(errorHandler);
