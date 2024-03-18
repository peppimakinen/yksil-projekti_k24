import express from 'express';
import {body, param} from 'express-validator';
import {
  getUserById,
  getUsers,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';
import {validationErrorHandler, customError} from '../middlewares/error-handler.mjs';

const userRouter = express.Router();

// /api/user endpoint
userRouter
  .route('/')
  /**
   * @api {get} /users Request user list
   * @apiName GetUsers
   * @apiGroup Users
   * @apiPermission token
   *
   * @apiSuccess {Array} user[] array of Users.
   * @apiSuccess {Object} user User object.
   * @apiSuccess {Number} user.user_id Id of the user.
   * @apiSuccess {String} user.username Username
   * @apiSuccess {String} user.user_level Userlevel of the User.
   *
   * TODO: add example response
   *
   * @apiUse InvalidTokenError
   */
  .get(authenticateToken, getUsers)
  // update user
  .put(
    authenticateToken,
    body('username', 'username must be 3-20 characters long and alphanumeric')
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('password', 'minimum password length is 8 characters')
      .trim()
      .isLength({min: 8, max: 128}),
    body('email', 'must be a valid email address')
      .trim()
      .isEmail()
      .normalizeEmail(),
    validationErrorHandler,
    putUser,
  )
  // user registration
  .post(
    body('username', 'username must be 3-20 characters long and alphanumeric')
      .trim()
      .isLength({min: 3, max: 20})
      .isAlphanumeric(),
    body('password', 'minimum password length is 8 characters')
      .trim()
      .isLength({min: 8, max: 128}),
    body('email', 'must be a valid email address')
      .trim()
      .isEmail()
      .normalizeEmail(),
    validationErrorHandler,
    postUser,
  );

// /user/:id endpoint
userRouter
  .route('/:id')
  // get info of a user
  .get(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    validationErrorHandler,
    getUserById,
  )
  // delete user based on id
  .delete(
    authenticateToken,
    param('id', 'must be integer').isInt(),
    validationErrorHandler,
    deleteUser,
  );

export default userRouter;
