import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Counter from "../models/Counter.js";

import Gst from "../models/Gst.js";
import Productitem from "../models/Productitem.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

import mongoose from "mongoose";
import { logAction } from "../utils/globalLogfun.js";
import GlobalLog from "../models/GlobalLog.js";

// export const createPurchaseOrder = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       supplierId,
//       Billingname,
//       PhnNo,
//       OrderNO,
//       OrderDate,
//       DueDate,
//       stateofsupply,
//       productItem,
//       overallDiscount,
//       advancedAmount,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     if (!Array.isArray(productItem)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "productItem must be an array", false));
//     }

//     let totalFinalAmount = 0;
//     let totalGST = 0;

//     const calculateDiscount = (base) => {
//       if (overallDiscount?.type === "amount") {
//         return parseFloat(overallDiscount.value || "0");
//       } else if (overallDiscount?.type === "percentage") {
//         return (base * parseFloat(overallDiscount.value || "0")) / 100;
//       }
//       return 0;
//     };

//     const encryptedItems = [];
//     const updatedProducts = [];

//     for (const product of productItem) {
//       const itemId = product.item[0]; // Assuming only one item per object
//       const quantity = parseFloat(product.qty || "1");
//       const cess = parseFloat(product.addCess || "0");
//       const priceWithoutTax = parseFloat(
//         product.pricePerUnit?.withoutTax || "0"
//       );
//       const priceWithTax = parseFloat(product.pricePerUnit?.withTax || "0");
//       const taxRefs = product.taxRef || [];

//       let gstRate = 0;
//       for (const gstId of taxRefs) {
//         const gst = await Gst.findById(gstId);
//         if (gst && gst.rate) {
//           const rateStr = decryptData(gst.rate).replace("%", "");
//           gstRate += parseFloat(rateStr || "0");
//         }
//       }

//       let baseAmount = 0;
//       let subtotalAfterCess = 0;
//       let afterDiscount = 0;
//       let secondGST = 0;
//       let finalTotal = 0;

//       if (priceWithoutTax > 0) {
//         baseAmount = quantity * priceWithoutTax;
//         const firstGST = (baseAmount * gstRate) / 100;
//         subtotalAfterCess = baseAmount + firstGST + cess;
//         const discountAmount = calculateDiscount(subtotalAfterCess);
//         afterDiscount = subtotalAfterCess - discountAmount;
//         secondGST = (afterDiscount * gstRate) / 100;
//         finalTotal = afterDiscount + secondGST;
//       } else if (priceWithTax > 0) {
//         baseAmount = quantity * priceWithTax;
//         subtotalAfterCess = baseAmount + cess;
//         const discountAmount = calculateDiscount(subtotalAfterCess);
//         afterDiscount = subtotalAfterCess - discountAmount;
//         secondGST = (afterDiscount * gstRate) / 100;
//         finalTotal = afterDiscount + secondGST;
//       }

//       totalFinalAmount += Math.round(finalTotal);
//       totalGST += secondGST;

//       // Update stock
//       const productDoc = await Productitem.findById(itemId);
//       if (productDoc) {
//         const oldReserved = parseFloat(
//           productDoc.stock.reservedQuantity || "0"
//         );
//         const oldAvailable = parseFloat(
//           productDoc.stock.availableForSale || "0"
//         );
//         const newReserved = oldReserved + quantity;
//         const newAvailable = Math.max(oldAvailable - quantity, 0);

//         productDoc.stock.reservedQuantity = newReserved.toFixed(2);
//         productDoc.stock.availableForSale = newAvailable.toFixed(2);
//         await productDoc.save();

//         updatedProducts.push({
//           productId: itemId,
//           reservedQuantity: newReserved.toFixed(2),
//           availableForSale: newAvailable.toFixed(2),
//         });

//         await stocklogSchema.create({
//           type: "purhase",
//           itemId,
//           godownId: productDoc.Godownid,
//           referenceNo: OrderNO,
//           status: "Unpaid",
//           quantity,
//           pricePerUnit: priceWithoutTax > 0 ? priceWithoutTax : priceWithTax,
//           date: new Date(),
//           editHistory: [],
//         });
//       }

//       // Store encrypted item data
//       encryptedItems.push({
//         item: [itemId],
//         qty: encryptData(quantity.toFixed(2))?.encryptedData,
//         unit: product.unit,
//         pricePerUnit: {
//           withTax: encryptData(priceWithTax.toFixed(2))?.encryptedData,
//           withoutTax: encryptData(priceWithoutTax.toFixed(2))?.encryptedData,
//         },
//         taxRef: taxRefs,
//         addCess: encryptData(cess.toFixed(2))?.encryptedData,
//         amount: encryptData(
//           (quantity * (priceWithoutTax || priceWithTax)).toFixed(2)
//         )?.encryptedData,
//       });
//     }

//     const advAmt = parseFloat(advancedAmount || "0");
//     const balance = totalFinalAmount - advAmt;

//     const newOrder = new PurchaseOrder({
//       supplierId,
//       Billingname: encryptData(Billingname)?.encryptedData,
//       PhnNo: encryptData(PhnNo)?.encryptedData,
//       OrderNO: encryptData(OrderNO)?.encryptedData,
//       OrderDate,
//       DueDate,
//       status: "order overdue",
//       stateofsupply,
//       productItem: encryptedItems,
//       overallDiscount: {
//         type: overallDiscount?.type,
//         value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//       },
//       totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
//       advancedAmount: encryptData(advAmt.toFixed(2))?.encryptedData,
//       tax: encryptData(totalGST.toFixed(2))?.encryptedData,
//       roundoff: encryptData("0")?.encryptedData,
//       paymentType,
//       Description: encryptData(Description || "")?.encryptedData,
//       image,
//       type: "Purchase Order",
//       action: ["convert to sale"],
//       balance: encryptData(balance.toFixed(2))?.encryptedData,
//     });

//     const saved = await newOrder.save();

//     // await storePaymentLog({
//     //   supplierId,
//     //   date: OrderDate,
//     //   type: "Purchase Order",
//     //   total: totalFinalAmount.toFixed(2),
//     //   recievedOrPaid: advAmt.toFixed(2),
//     //   balance: balance.toFixed(2),
//     //   paymentTypeId: paymentType,
//     // });

//     // await logEvent({
//     //   supplierId,
//     //   insertId: saved._id,
//     //   type: "Purchase Order",
//     //   event: "create",
//     //   data: {
//     //     totalAmount: totalFinalAmount.toFixed(2),
//     //     advancedAmount: advAmt.toFixed(2),
//     //     balance: balance.toFixed(2),
//     //     status: "order overdue",
//     //   },
//     // });

//     return res.status(201).json(
//       successResponse(201, "Purchase order created successfully", null, true, {
//         id: saved._id,
//         updatedStock: updatedProducts,
//       })
//     );
//   } catch (error) {
//     console.error("Sale Order Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };
//#######################################################################################################

// the calculation is of abv according to sale order and for storing in payment log(old code)

// export const createPurchaseOrder = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       supplierId,
//       Billingname,
//       PhnNo,
//       OrderNO,
//       OrderDate,
//       DueDate,
//       // stateofsupply,
//       productItem,
//       overallDiscount,
//       advancedAmount,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     if (!Array.isArray(productItem)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "productItem must be an array", false));
//     }

//     let totalFinalAmount = 0;
//     let totalGST = 0;

//     const calculateDiscount = (base) => {
//       if (overallDiscount?.type === "amount") {
//         return parseFloat(overallDiscount.value || "0");
//       } else if (overallDiscount?.type === "percentage") {
//         return (base * parseFloat(overallDiscount.value || "0")) / 100;
//       }
//       return 0;
//     };

//     const encryptedItems = [];
//     const updatedProducts = [];

//     for (const product of productItem) {
//       const itemId = product.item[0];
//       const quantity = parseFloat(product.qty || "1");
//       const cess = parseFloat(product.addCess || "0");
//       const priceWithoutTax = parseFloat(
//         product.pricePerUnit?.withoutTax || "0"
//       );
//       const priceWithTax = parseFloat(product.pricePerUnit?.withTax || "0");
//       const taxRefs = product.taxRef || [];

//       let gstRate = 0;
//       for (const gstId of taxRefs) {
//         const gst = await Gst.findById(gstId);
//         if (gst && gst.rate) {
//           const rateStr = decryptData(gst.rate).replace("%", "");
//           gstRate += parseFloat(rateStr || "0");
//         }
//       }

//       let baseAmount = 0;
//       let subtotalAfterCess = 0;
//       let afterDiscount = 0;
//       let secondGST = 0;
//       let finalTotal = 0;

//       if (priceWithoutTax > 0) {
//         baseAmount = quantity * priceWithoutTax;
//         const firstGST = (baseAmount * gstRate) / 100;
//         subtotalAfterCess = baseAmount + firstGST + cess;
//         const discountAmount = calculateDiscount(subtotalAfterCess);
//         afterDiscount = subtotalAfterCess - discountAmount;
//         secondGST = (afterDiscount * gstRate) / 100;
//         finalTotal = afterDiscount + secondGST;
//       } else if (priceWithTax > 0) {
//         baseAmount = quantity * priceWithTax;
//         subtotalAfterCess = baseAmount + cess;
//         const discountAmount = calculateDiscount(subtotalAfterCess);
//         afterDiscount = subtotalAfterCess - discountAmount;
//         secondGST = (afterDiscount * gstRate) / 100;
//         finalTotal = afterDiscount + secondGST;
//       }

//       totalFinalAmount += Math.round(finalTotal);
//       totalGST += secondGST;

//       //   const productDoc = await Productitem.findById(itemId);
//       //   if (productDoc) {
//       //     const oldAvailable = parseFloat(
//       //       productDoc.stock.availableForSale || "0"
//       //     );
//       //     const newAvailable = oldAvailable + quantity;

//       //     productDoc.stock.availableForSale = newAvailable.toFixed(2);
//       //     await productDoc.save();

//       //     updatedProducts.push({
//       //       productId: itemId,
//       //       availableForSale: newAvailable.toFixed(2),
//       //     });

//       //     await stocklogSchema.create({
//       //       type: "purchase",
//       //       itemId,
//       //       godownId: productDoc.Godownid,
//       //       referenceNo: OrderNO,
//       //       status: "Unpaid",
//       //       quantity,
//       //       pricePerUnit: priceWithoutTax > 0 ? priceWithoutTax : priceWithTax,
//       //       date: new Date(),
//       //       editHistory: [],
//       //     });
//       //   }

//       encryptedItems.push({
//         item: [itemId],
//         qty: encryptData(quantity.toFixed(2))?.encryptedData,
//         unit: product.unit,
//         pricePerUnit: {
//           withTax: encryptData(priceWithTax.toFixed(2))?.encryptedData,
//           withoutTax: encryptData(priceWithoutTax.toFixed(2))?.encryptedData,
//         },
//         taxRef: taxRefs,
//         addCess: encryptData(cess.toFixed(2))?.encryptedData,
//         amount: encryptData(
//           (quantity * (priceWithoutTax || priceWithTax)).toFixed(2)
//         )?.encryptedData,
//       });
//     }

//     const advAmt = parseFloat(advancedAmount || "0");
//     const balance = totalFinalAmount - advAmt;

//     const newOrder = new PurchaseOrder({
//       supplierId,
//       Billingname: encryptData(Billingname)?.encryptedData,
//       PhnNo: encryptData(PhnNo)?.encryptedData,
//       OrderNO: encryptData(OrderNO)?.encryptedData,
//       OrderDate,
//       DueDate,
//       status: "order overdue",
//       // stateofsupply,
//       productItem: encryptedItems,
//       overallDiscount: {
//         type: overallDiscount?.type,
//         value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//       },
//       totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
//       advancedAmount: encryptData(advAmt.toFixed(2))?.encryptedData,
//       tax: encryptData(totalGST.toFixed(2))?.encryptedData,
//       roundoff: encryptData("0")?.encryptedData,
//       paymentType,
//       Description: encryptData(Description || "")?.encryptedData,
//       image,
//       type: "Purchase Order",
//       //   action: ["convert to Purchase"],
//       balance: encryptData(balance.toFixed(2))?.encryptedData,
//     });

//     const saved = await newOrder.save();

//     return res.status(201).json(
//       successResponse(201, "Purchase order created successfully", null, true, {
//         id: saved._id,
//         updatedStock: updatedProducts,
//       })
//     );
//   } catch (error) {
//     console.error("Purchase Order Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const getNextOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "purchaseOrder" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `PO-${counter.seq.toString().padStart(6, "0")}`;
};

export const generateOrderNumber = async (req, res) => {
  try {
    const orderNo = await getNextOrderNumber();
    return res
      .status(200)
      .json(
        successResponse(200, "Order number generated", null, true, { orderNo })
      );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse(500, "Failed to generate order number", false));
  }
};

export const createPurchaseOrder = async (req, res) => {
  try {
    const user = req.user;

    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      supplierId,
      Billingname,
      PhnNo,
      OrderNO,
      OrderDate,
      DueDate,
      productItem,
      advancedAmount,
      paymentType,
      Description,
      invoiceNo,
      type,
    } = decrypted;

    if (!invoiceNo) {
      return res
        .status(400)
        .json(errorResponse(400, "invoiceNo is required", false));
    }

    //  Check for duplicate invoice number
    const existingInvoice = await PurchaseOrder.find({
      invoiceNo: encryptData(invoiceNo)?.encryptedData,
      userId: user,
    });
    if (existingInvoice.length > 0) {
      return res
        .status(409)
        .json(errorResponse(409, "Duplicate invoice number", false));
    }

    // Check for duplicate order number
    const existingOrder = await PurchaseOrder.find({
      OrderNO: encryptData(OrderNO)?.encryptedData,
      userId: user,
    });

    if (existingOrder.length > 0) {
      return res
        .status(409)
        .json(errorResponse(409, "Duplicate order number", false));
    }

    if (!Array.isArray(productItem)) {
      return res
        .status(400)
        .json(errorResponse(400, "productItem must be an array", false));
    }

    let totalFinalAmount = 0;
    let totalGST = 0;

    const encryptedItems = [];
    const updatedProducts = [];

    for (const product of productItem) {
      const itemId = product.item[0];
      const quantity = parseFloat(product.qty || "1");
      const cess = parseFloat(product.addCess || "0");
      const priceWithoutTax = parseFloat(
        product.pricePerUnit?.withoutTax || "0"
      );
      const priceWithTax = parseFloat(product.pricePerUnit?.withTax || "0");
      const taxRefs = Array.isArray(product.taxRef) ? product.taxRef : [];

      let gstRate = 0;

      for (const gstId of taxRefs) {
        if (!mongoose.Types.ObjectId.isValid(gstId)) continue;
        const gst = await Gst.findById(gstId);
        if (gst && gst.rate) {
          const rateStr = decryptData(gst.rate).replace("%", "");
          gstRate += parseFloat(rateStr || "0");
        }
      }

      let baseAmount = 0;
      let subtotalAfterCess = 0;
      let secondGST = 0;
      let finalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        const firstGST = (baseAmount * gstRate) / 100;
        subtotalAfterCess = baseAmount + firstGST + cess;
        secondGST = (subtotalAfterCess * gstRate) / 100;
        finalTotal = subtotalAfterCess + secondGST;
      } else if (priceWithTax > 0) {
        baseAmount = quantity * priceWithTax;
        subtotalAfterCess = baseAmount + cess;
        secondGST = (subtotalAfterCess * gstRate) / 100;
        finalTotal = subtotalAfterCess + secondGST;
      }

      totalFinalAmount += Math.round(finalTotal);
      totalGST += secondGST;

      encryptedItems.push({
        item: [itemId],
        qty: encryptData(quantity.toFixed(2))?.encryptedData,
        unit: product.unit,
        pricePerUnit: {
          withTax: encryptData(priceWithTax.toFixed(2))?.encryptedData,
          withoutTax: encryptData(priceWithoutTax.toFixed(2))?.encryptedData,
        },
        taxRef: taxRefs,
        addCess: encryptData(cess.toFixed(2))?.encryptedData,
        amount: encryptData(
          (quantity * (priceWithoutTax || priceWithTax)).toFixed(2)
        )?.encryptedData,
      });
    }

    const advAmt = parseFloat(advancedAmount || "0");
    const balance = totalFinalAmount - advAmt;

    const newOrder = new PurchaseOrder({
      supplierId,
      Billingname: encryptData(Billingname)?.encryptedData,
      PhnNo: encryptData(PhnNo)?.encryptedData,
      OrderNO: encryptData(OrderNO)?.encryptedData,
      OrderDate,
      DueDate,
      status: "order overdue",
      productItem: encryptedItems,
      totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
      advancedAmount: encryptData(advAmt.toFixed(2))?.encryptedData,
      tax: encryptData(totalGST.toFixed(2))?.encryptedData,
      roundoff: encryptData("0")?.encryptedData,
      paymentType,
      Description: encryptData(Description || "")?.encryptedData,
      type: "Purchase Order",
      balance: encryptData(balance.toFixed(2))?.encryptedData,
      invoiceNo: encryptData(invoiceNo)?.encryptedData,
      userId: user,
    });

    const saved = await newOrder.save();
    await logAction({
      endpoint: req.originalUrl,
      method: req.method,
      action: "CREATE",
      userId: user,
      dataAfter: saved.toObject(),
      message: `Purchase Order created with OrderNO ${OrderNO}`,
    });

    return res.status(201).json(
      successResponse(201, "Purchase order created successfully", null, true, {
        id: saved._id,
        updatedStock: updatedProducts,
      })
    );
  } catch (error) {
    console.error("Purchase Order Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const getAllPurchaseOrder = async (req, res) => {
  try {
    const safeDecrypt = (val) =>
      typeof val === "string" && val ? decryptData(val) : null;

    const PurchaseOrders = await PurchaseOrder.find()
      .populate("supplierId", "supplierName")
      .populate("productItem.item", "itemName")
      .populate("productItem.unit", "sortName unitName")
      .populate("productItem.taxRef", "rate label")
      .exec();

    if (!PurchaseOrders || PurchaseOrders.length === 0) {
      return res
        .status(404)
        .json(errorResponse(404, "No purchase orders found", false));
    }
    const decryptedOrders = PurchaseOrders.map((order) => ({
      id: order._id,
      supplierId: order.supplierId
        ? {
            _id: order.supplierId._id,
            supplierName: safeDecrypt(order.supplierId.supplierName),
          }
        : null,
      // Billingname: safeDecrypt(order.Billingname),
      PhnNo: safeDecrypt(order.PhnNo),
      invoiceNo: safeDecrypt(order.invoiceNo),
      OrderNO: safeDecrypt(order.OrderNO),
      OrderDate: order.OrderDate,
      DueDate: order.DueDate,
      status: order.status,
      // stateofsupply: order.stateofsupply,
      action: order.action,
      balance: safeDecrypt(order.balance),
      productItem: order.productItem.map((prod) => ({
        item:
          prod.item?.map((itm) => ({
            _id: itm._id,
            itemName: safeDecrypt(itm.itemName),
          })) || [],
        count: safeDecrypt(prod.count),
        qty: safeDecrypt(prod.qty),
        freeQty: safeDecrypt(prod.freeQty),
        unit:
          prod.unit?.map((uni) => ({
            _id: uni._id,
            sortName: safeDecrypt(uni.sortName),
            unitName: safeDecrypt(uni.unitName),
          })) || [],
        pricePerUnit: {
          withTax: safeDecrypt(prod.pricePerUnit?.withTax),
          withoutTax: safeDecrypt(prod.pricePerUnit?.withoutTax),
        },
        taxRef:
          prod.taxRef?.map((tax) => ({
            _id: tax._id,
            rate: safeDecrypt(tax.rate),
            label: safeDecrypt(tax.label),
          })) || [],
        addCess: safeDecrypt(prod.addCess),
        amount: safeDecrypt(prod.amount),
      })),
      roundoff: safeDecrypt(order.roundoff),
      // overallDiscount: {
      //   type: order.overallDiscount?.type,
      //   value: safeDecrypt(order.overallDiscount?.value),
      // },
      totalAmount: safeDecrypt(order.totalAmount),
      advancedAmount: safeDecrypt(order.advancedAmount),
      paymentType: order.paymentType,
      Description: safeDecrypt(order.Description),
      tax: safeDecrypt(order.tax),
      type: order.type,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Purchase orders fetched successfully",
          "",
          true,
          decryptedOrders
        )
      );
  } catch (error) {
    console.error("Get All purchase Orders Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const user = req.user;

    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));
    const { id } = req.params;

    const {
      supplierId,
      Billingname,
      PhnNo,
      OrderNO,
      OrderDate,
      DueDate,
      productItem,
      advancedAmount,
      paymentType,
      Description,
      type,
      invoiceNo,
    } = decrypted;

    if (!invoiceNo) {
      return res
        .status(400)
        .json(errorResponse(400, "invoiceNo is required", false));
    }

    if (!Array.isArray(productItem)) {
      return res
        .status(400)
        .json(errorResponse(400, "productItem must be an array", false));
    }

    let totalFinalAmount = 0;
    let totalGST = 0;
    const encryptedItems = [];

    for (const product of productItem) {
      const itemId = product.item[0];
      const quantity = parseFloat(product.qty || "1");
      const cess = parseFloat(product.addCess || "0");
      const priceWithoutTax = parseFloat(
        product.pricePerUnit?.withoutTax || "0"
      );
      const priceWithTax = parseFloat(product.pricePerUnit?.withTax || "0");
      const taxRefs = Array.isArray(product.taxRef) ? product.taxRef : [];

      let gstRate = 0;
      for (const gstId of taxRefs) {
        if (!mongoose.Types.ObjectId.isValid(gstId)) continue;
        const gst = await Gst.findById(gstId);
        if (gst && gst.rate) {
          const rateStr = decryptData(gst.rate).replace("%", "");
          gstRate += parseFloat(rateStr || "0");
        }
      }

      let baseAmount = 0;
      let subtotalAfterCess = 0;
      let secondGST = 0;
      let finalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        const firstGST = (baseAmount * gstRate) / 100;
        subtotalAfterCess = baseAmount + firstGST + cess;
        secondGST = (subtotalAfterCess * gstRate) / 100;
        finalTotal = subtotalAfterCess + secondGST;
      } else if (priceWithTax > 0) {
        baseAmount = quantity * priceWithTax;
        subtotalAfterCess = baseAmount + cess;
        secondGST = (subtotalAfterCess * gstRate) / 100;
        finalTotal = subtotalAfterCess + secondGST;
      }

      totalFinalAmount += Math.round(finalTotal);
      totalGST += secondGST;

      encryptedItems.push({
        item: [itemId],
        qty: encryptData(quantity.toFixed(2))?.encryptedData,
        unit: product.unit,
        pricePerUnit: {
          withTax: encryptData(priceWithTax.toFixed(2))?.encryptedData,
          withoutTax: encryptData(priceWithoutTax.toFixed(2))?.encryptedData,
        },
        taxRef: taxRefs,
        addCess: encryptData(cess.toFixed(2))?.encryptedData,
        amount: encryptData(
          (quantity * (priceWithoutTax || priceWithTax)).toFixed(2)
        )?.encryptedData,
      });
    }

    const advAmt = parseFloat(advancedAmount || "0");
    const balance = totalFinalAmount - advAmt;
    const existing = await PurchaseOrder.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json(errorResponse(404, "Purchase Order not found", false));
    }

    const dataBefore = existing.toObject();
    const updated = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        supplierId,
        Billingname: encryptData(Billingname)?.encryptedData,
        PhnNo: encryptData(PhnNo)?.encryptedData,
        OrderNO: encryptData(OrderNO)?.encryptedData,
        OrderDate,
        DueDate,
        productItem: encryptedItems,
        totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
        advancedAmount: encryptData(advAmt.toFixed(2))?.encryptedData,
        tax: encryptData(totalGST.toFixed(2))?.encryptedData,
        roundoff: encryptData("0")?.encryptedData,
        paymentType,
        Description: encryptData(Description || "")?.encryptedData,
        type: "Purchase Order",
        balance: encryptData(balance.toFixed(2))?.encryptedData,
        invoiceNo: encryptData(invoiceNo)?.encryptedData,
        userId: user,
      },
      { new: true }
    );
    await logAction({
      endpoint: req.originalUrl,
      method: req.method,
      action: "UPDATE",
      userId: user,
      dataBefore,
      dataAfter: updated.toObject(),
      message: `Purchase Order updated with ID ${id}`,
    });

    if (!updated) {
      return res
        .status(404)
        .json(errorResponse(404, "Purchase Order not found", false));
    }

    return res.status(200).json(
      successResponse(200, "Purchase order updated successfully", null, true, {
        id: updated._id,
      })
    );
  } catch (error) {
    console.error("Update Purchase Order Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const getGlobalLogs = async (req, res) => {
  try {
    const {
      method,
      action,
      userId,
      fromDate,
      toDate,
      endpoint,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (method) filter.method = method.toUpperCase();
    if (action) filter.action = action.toUpperCase();
    if (userId) filter.userId = userId;
    if (endpoint) filter.endpoint = { $regex: endpoint, $options: "i" };
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const logs = await GlobalLog.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await GlobalLog.countDocuments(filter);

    const responseData = {
      logs,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    };

    return res.status(200).json(
      successResponse(
        200,
        "Logs fetched successfully",
        "",
        true,
        responseData
      )
    );
  } catch (error) {
    console.error("Get Logs Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};