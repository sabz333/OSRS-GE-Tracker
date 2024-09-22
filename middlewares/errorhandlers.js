const errorHandler = (error, req, res, next) => {

  // set status code to 500
  res.status(500);

  // return internal server error text
  res.send("Internal Server Error");

  //console log error
  console.log(error.stack);
};

export{errorHandler};