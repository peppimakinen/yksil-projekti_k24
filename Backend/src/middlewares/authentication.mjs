import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {customError} from '../middlewares/error-handler.mjs';

const authenticateToken = (req, res, next) => {
  // console.log('authenticateToken', req.headers);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  // console.log('token', token);
  if (!token) {
    return next(customError('Token missing', 401));
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(customError('Invalid token', 401));
  }
};

const isOwner = (req, res, next) => {
  // Check if the user is the owner of the resource based on the request parameters
  if (req.user && req.user.id === req.params.id) {
    next();
  } else {
    return res.status(403).json({error: 'Forbidden'});
  }
};

export {authenticateToken, isOwner};
