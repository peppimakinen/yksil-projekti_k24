import {
  listAllEntries,
  findEntryById,
  addEntry,
  deleteEntryById,
  updateEntryById,
  listAllEntriesByUserId,
} from '../models/entry-model.mjs';
import {notFoundHandler, errorHandler} from '../middlewares/error-handler.mjs';

const getEntries = async (req, res) => {
  // return only logged in user's own entries
  // - get user's id from token (req.user.user_id)
  const result = await listAllEntriesByUserId(req.user.user_id);
  if (!result.error) {
    res.json(result);
  } else {
    errorHandler;
  }
};

const getEntryById = async (req, res) => {
  const entry = await findEntryById(req.params.id);
  if (entry) {
    res.json(entry);
  } else {
    notFoundHandler;
  }
};

const postEntry = async (req, res) => {
  const {user_id, entry_date, severity, triggers, duration_hours, other_symptoms} = req.body;
  if (entry_date && (severity || triggers || duration_hours || other_symptoms) && user_id) {
    const result = await addEntry(req.body);
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      errorHandler;
    }
  } else {
    notFoundHandler;
  }
};

const putEntry = async (req, res) => {
  const entry_id = req.params.id;
  const {entry_date, severity, triggers, duration_hours, other_symptoms} = req.body;
  // check that all needed fields are included in request
  if ((entry_date || severity || triggers || duration_hours || other_symptoms) && entry_id) {
    const result = await updateEntryById({entry_id, ...req.body});
    if (result.error) {
      return res.status(result.error).json(result);
    }
    return res.status(201).json(result);
  } else {
    notFoundHandler;
  }
};

const deleteEntry = async (req, res) => {
  const result = await deleteEntryById(req.params.id);
  if (result.error) {
    return res.status(result.error).json(result);
  }
  return res.json(result);
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};
