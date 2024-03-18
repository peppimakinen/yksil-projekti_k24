// Note: db functions are async and must be
// called with await from the controller
import promisePool from '../utils/database.mjs';

const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');
    // console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const listAllEntriesByUserId = async (id) => {
  try {
    const sql = 'SELECT * FROM NauseaEntries WHERE user_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    // console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const findEntryById = async (id) => {
  try {
    const [rows] = await promisePool.query(
        'SELECT * FROM NauseaEntries WHERE entry_id = ?',
        [id],
    );
    // console.log('rows', rows);
    return rows[0];
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const addEntry = async (entry) => {
  const {user_id, entry_date, severity, triggers, duration_hours, other_symptoms} = entry;
  const sql = `INSERT INTO NauseaEntries (user_id, entry_date, severity, triggers, duration_hours, other_symptoms)
  VALUES (?, ?, ?, ?, ?, ?)`;
  const params = [user_id, entry_date, severity, triggers, duration_hours, other_symptoms];
  try {
    // change query method?
    const rows = await promisePool.query(sql, params);
    // console.log('rows', rows);
    return {entry_id: rows[0].insertId};
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

const updateEntryById = async (entry) => {
  const {entry_id, severity, triggers, duration_hours, other_symptoms} = entry;
  try {
    const sql =
      'UPDATE NauseaEntries SET severity=?, triggers=?, duration_hours=?, other_symptoms=? WHERE entry_id=?';
    const params = [severity, triggers, duration_hours, other_symptoms, entry_id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry data updated', entry_id};
  } catch (error) {
    // fix error handling
    // now duplicate entry error is generic 500 error, should be fixed to 400 ?
    console.error('updateEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

const deleteEntryById = async (id) => {
  try {
    const sql = 'DELETE FROM NauseaEntries WHERE entry_id=?';
    const params = [id];
    const [result] = await promisePool.query(sql, params);
    // console.log(result);
    if (result.affectedRows === 0) {
      return {error: 404, message: 'entry not found'};
    }
    return {message: 'entry deleted', entry_id: id};
  } catch (error) {
    console.error('deleteEntryById', error);
    return {error: 500, message: 'db error'};
  }
};

export {
  listAllEntries,
  listAllEntriesByUserId,
  findEntryById,
  addEntry,
  updateEntryById,
  deleteEntryById,
};
