import StatusCode from '../helpers/statusCode';

const isValidContentType = (req, res, next) => {
  const contype = req.headers['content-type'];
  if (!contype || contype.indexOf('application/json') !== 0) {
    return res.status(StatusCode.UNSUPPORTED_CONTENT_TYPE).send({
      status: StatusCode.UNSUPPORTED_CONTENT_TYPE,
      error: 'content type for request must be application/json',
    });
  }

  next();
};

export default isValidContentType;
