function errorHandler(error, req, res, next) {
  //console log error
  console.error(error.stack);

  // set status code to 500
  res.status(500);

  // return internal server error page
  res.render("serverError.ejs", {
    message:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong.",
  });
}

export { errorHandler };
