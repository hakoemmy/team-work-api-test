import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';
import StatusCode from '../helpers/statusCode';

dotenv.config();

const isEmployee = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(StatusCode.UNAUTHORIZED).send({
      status: StatusCode.UNAUTHORIZED,
      error: 'System rejected. No access token found!',
    });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWTSECRET);
    if (!User.isUserExist(id)) {
      return res.status(StatusCode.NOT_FOUND).send({
        status: StatusCode.NOT_FOUND,
        error: 'Awww, Snap!..Such kind of access token does not match any employee!',
      });
    }
    next();
  } catch (error) {
    return res.status(StatusCode.BAD_REQUEST).send({
      status: StatusCode.BAD_REQUEST,
      error: error.message,
    });
  }
};

export default isEmployee;
