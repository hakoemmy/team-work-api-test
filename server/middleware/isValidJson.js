import StatusCode from '../helpers/statusCode';

const isValidJson = (error, req, res, next) => {
  // This check makes sure this is a JSON parsing issue,
  // but it might be
  // coming from any middleware, not just body-parser
  if (error instanceof SyntaxError
     && error.status === 400 && 'body' in error) {
    return res.status(StatusCode.BAD_REQUEST).send({
      status: StatusCode.BAD_REQUEST,
      error: 'it seems that JSON request is invalid!',
    });
  }
  next();
};

export default isValidJson;
