/** All custom error options **/

class DatabaseError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "Database Error";
  }

  display() {
    console.log(this.stack);
  }
}

class WebError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "Web Error";
  }

  display() {
    console.log(this.stack);
  }
}

export { DatabaseError, WebError };