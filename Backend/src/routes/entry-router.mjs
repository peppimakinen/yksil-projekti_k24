import express from 'express';
import {body} from 'express-validator';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry,
} from '../controllers/entry-controller.mjs';
import {authenticateToken} from '../middlewares/authentication.mjs';

const entryRouter = express.Router();

entryRouter.route('/')
  .get(authenticateToken, getEntries)
  .post(
    body('user_id').isAlphanumeric(),
    body('entry_date').isDate(),
    body('severity').isIn(["Mild", "Moderate", "Severe"]),
    body('triggers').isLength({max: 500}),
    body('duration_hours').isInt({max: 24}),
    body('other_symptoms').isLength({max: 500}),
    authenticateToken,
    postEntry
  );

entryRouter.route('/:id')
  .get(getEntryById)
  .put(authenticateToken, putEntry)
  .delete(authenticateToken, deleteEntry);

export default entryRouter;
