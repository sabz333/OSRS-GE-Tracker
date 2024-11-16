import Router from "express-promise-router";
import passport from "passport";
const router = new Router();

// router to handle search queries from search bar

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/dashboard",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

router.get("/logout", (req, res) => {
  req.logout(function (error) {
    if (error) {
      return next(error);
    } else {
      res.redirect("/");
    }
  });
});

export default router;
