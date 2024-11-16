import Router from "express-promise-router";
import passport from "passport";
const router = new Router();

// router to handle search queries from search bar

router.get(
  "/", async (req, res) => {
    if (req.isAuthenticated()) {
      res.render("dashboard.ejs");
    } else {
      res.redirect("/login");
    }
  }
);

export default router;