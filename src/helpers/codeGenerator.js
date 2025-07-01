
import { v4 as uuidv4 } from 'uuid';

export const generateUniqueCode = () => `${uuidv4().replace(/\D/g, '').slice(0, 8)}`;

