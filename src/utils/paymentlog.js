import paymentlogmodel from "../models/paymentlogmodel.js";

export const storePaymentLog = async ({
  partyId,
  date = new Date(),
  type, // "paymentIn", "paymentOut", "sale", "purchase", "saleorder"
  total = "0.00",
  recievedOrPaid = "0.00",
  balance = "0.00",
  paymentTypeId = null,
}) => {
  try {
    const newLog = new paymentlogmodel({
      party: partyId,
      date,
      type,
      total: total.toString(),
      recievedorpaid: recievedOrPaid.toString(),
      Balance: balance.toString(),
      paymentType: paymentTypeId,
    });

    const savedLog = await newLog.save();
    return savedLog;
  } catch (error) {
    console.error("Error storing payment log:", error);
    throw error;
  }
};