
import NotFoundError from "../exceptions/NotFoundError.exception.js";

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError());
};

export default notFoundHandler;