import stocklogSchema from "../models/stocklogSchema.js";

// export const logStockEvent = async ({ itemId, godownId, type, referenceNo, status, quantity, pricePerUnit, createdBy, data = {} }) => {
//   try {
//     const stockLog = await stocklogSchema.create({
//       itemId,
//       godownId,
//       type,
//       referenceNo,
//       status,
//       quantity,
//       pricePerUnit,
//       userId: createdBy,
//       data,
//     });
    
//     console.log('Stock event logged successfully:', stockLog);
//   } catch (err) {
//     console.error('Stock event logging failed:', err.message);
//   }
// };


// export const logStockEvent = async ({
//   itemId,
//   godownId,
//   type,
//   referenceNo,
//   status,
//   quantity,
//   pricePerUnit,
//   createdBy,
//   data = {},
//   oldValues = null,
//   newValues = null,
// }) => {
//   try {
//    const editEntry = oldValues && newValues
//       ? [{
//           operationType: type,
//           oldValues: {
//             quantity: oldValues.quantity,
//             pricePerUnit: oldValues.pricePerUnit,
//           },
//           newValues: {
//             quantity: newValues.quantity,
//             pricePerUnit: newValues.pricePerUnit,
//           },
//           modifiedBy: createdBy,
//           modifiedAt: new Date(),
//           reason: reason,
//         }]
//       : [];

//     const stockLog = await stocklogSchema.create({
//       itemId,
//       godownId,
//       type,
//       referenceNo,
//       status,
//       quantity,
//       pricePerUnit,
//       userId: createdBy,
//       data,
//       editHistory: editEntry,
//     });

//     console.log('Stock event logged successfully:', stockLog);
//   } catch (err) {
//     console.error('Stock event logging failed:', err.message);
//   }
// };


export const logStockEvent = async ({
  itemId,
  godownId,
  type,
  referenceNo,
  status,
  quantity,
  pricePerUnit,
  createdBy,
  data = {},
  oldValues = null,
  newValues = null,
  reason = "",
}) => {
  try {
    const editEntry = oldValues && newValues
      ? [{
          operationType: type,
          oldValues: {
            quantity: oldValues.quantity,
            pricePerUnit: oldValues.pricePerUnit,
          },
          newValues: {
            quantity: newValues.quantity,
            pricePerUnit: newValues.pricePerUnit,
          },
          modifiedBy: createdBy,
          modifiedAt: new Date(),
          reason: reason || `${type} stock`,
        }]
      : [];
 
    const stockLog = await stocklogSchema.create({
      itemId,
      godownId,
      type,
      referenceNo,
      status,
      quantity,
      pricePerUnit,
      userId: createdBy,
      data,
      editHistory: editEntry,
    });
 
    console.log('Stock event logged successfully:', stockLog);
  } catch (err) {
    console.error('Stock event logging failed:', err.message);
  }
};



