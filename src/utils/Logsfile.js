import Log from '../models/Log.js';


export const logEvent = async ({ partyId, insertId, type, event, data = {} }) => {
  try {
    await Log.create({
      partyId,
      insertId,
      type,
      event,
      data,
    });
  } catch (err) {
    console.error('Logging failed:', err.message);
  }
};

