import express from 'express';
import {
 assignCode,  
} from '../controller/itemCode.js';


const itemCoderouter = express.Router();


itemCoderouter.post('/code/assign-code', assignCode);


export default itemCoderouter;
