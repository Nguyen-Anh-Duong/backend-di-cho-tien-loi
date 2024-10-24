class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
  }
}

module.exports = ApiError;
