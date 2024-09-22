const errorHandler = (error, req, res, next) => {

  // set status code to 500
  res.status(500);

  //console log error
  console.log(error.stack);
  
  // return internal server error page
  res.render("serverError.ejs");
};

export{errorHandler};