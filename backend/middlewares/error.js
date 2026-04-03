export default (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error.";
  let errors = err.errors || [];

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    message = `Invalid resource identifier: ${err.path}`;
    statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    errors = Object.values(err.errors).map((val) => val.message);
    message = "Validation Error";
    statusCode = 400;
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    message = `This ${Object.keys(err.keyValue)} already registered. Please Login to contiue.`;
    statusCode = 409;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    // Show stack only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
