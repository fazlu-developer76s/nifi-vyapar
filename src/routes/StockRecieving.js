import express from "express";
import { receiveAndInspectGoods } from "../controller/stockrecievingIn.Controller.js";

const StockInRecieving = express.Router();

StockInRecieving.post("stockrecieving", receiveAndInspectGoods);

export default StockInRecieving;
