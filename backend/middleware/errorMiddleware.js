const asyncHandler = (callback) => {
  return function (req, res, next) {
    return callback(req, res, next).catch(next);
  };
};

const errorHandler = (err, req, res, next) => {
  console.log(`inside the error handler: ${res.statusCode}, hasError`, !!err);
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
  asyncHandler,
};
