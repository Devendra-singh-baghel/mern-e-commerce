const asyncHandler = (requestHandler) => {
  // asyncHandler is a higher-order function
  // It takes a requestHandler (controller function) as an argument

  return (req, res, next) => {
    // It returns a new middleware function that Express will execute

    Promise.resolve(requestHandler(req, res, next))
      // Executes the requestHandler function
      // Promise.resolve ensures that it always behaves like a Promise
      // (works for both async and normal functions)

      .catch((err) => next(err));
    // If any error occurs, it is caught here
    // and passed to Express error-handling middleware using next()
  };
};

export default asyncHandler;

/*
Q. Why use asyncHandler?

Ans: asyncHandler is used to wrap async route handlers so that any errors
are automatically caught and passed to Express error middleware,
eliminating the need for try-catch blocks in every controller.
*/
