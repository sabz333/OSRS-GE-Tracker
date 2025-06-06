function checkAuthentication(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

export { checkAuthentication };
