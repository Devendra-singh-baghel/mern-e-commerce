class HandleError extends Error {
  constructor(
    message = "Something went wrong",
    statusCode = 500,
    errors = [],
    stack = "",
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;

    // Optional: attach extra data if needed in future
    // this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default HandleError;

/*
Q. Why create custom error class?

Ans: It allows us to standardize error handling, include HTTP status codes,
structured error messages, and additional metadata, making APIs more
consistent and easier to debug.
*/
