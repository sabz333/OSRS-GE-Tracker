import Router from "express-promise-router";

const router = new Router();
const mainStyleSheet = "styles/main.css";

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login.ejs", {
      mainStyleSheet: mainStyleSheet,
    });
  }
});

export default router;