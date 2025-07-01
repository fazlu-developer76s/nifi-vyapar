import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Gst from "../models/Gst.js";
import paymentlogmodel from "../models/paymentlogmodel.js";
import Productitem from "../models/Productitem.js";
import SaleInvoice from "../models/SaleInvoice.js";
import saleOrder from "../models/saleOrder.js";
import stocklogSchema from "../models/stocklogSchema.js";
import { logEvent } from "../utils/Logsfile.js";
import Party from "../models/Party.js";
import { storePaymentLog } from "../utils/paymentlog.js";

// export const createSaleOrder = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       Billingname,
//       PhnNo,
//       OrderNO,
//       OrderDate,
//       DueDate,
//       stateofsupply,
//       item,
//       qty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       advancedAmount,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     const finalQty = Array.isArray(qty) ? qty : [];
//     const finalAddCess = Array.isArray(addCess) ? addCess : [];
//     const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax)
//       ? pricePerUnit.withoutTax
//       : [];
//     const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax)
//       ? pricePerUnit.withTax
//       : [];

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

//     for (let i = 0; i < item.length; i++) {
//       const quantity = parseFloat(finalQty[i] || "1");
//       const cess = parseFloat(finalAddCess[i] || "0");
//       const priceWithoutTax = parseFloat(finalPriceWithoutTax[i] || "0");
//       const priceWithTax = parseFloat(finalPriceWithTax[i] || "0");

//       let gstRate = 0;
//       const gst = await Gst.findById(taxRef[i]);
//       if (gst && gst.rate) {
//         const rateStr = decryptData(gst.rate).replace("%", "");
//         gstRate = parseFloat(rateStr || "0");
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
//     }

//     const encryptArray = (arr = [], fallback = "0") =>
//       arr.map((val) => encryptData(val || fallback)?.encryptedData);

//     const encryptedQty = encryptArray(finalQty);
//     const encryptedAddCess = encryptArray(finalAddCess);
//     const encryptedPriceWithoutTax = encryptArray(finalPriceWithoutTax);
//     const encryptedPriceWithTax = encryptArray(finalPriceWithTax);

//     const encryptedAmountPerItem = finalQty.map((_, i) => {
//       const qtyVal = parseFloat(finalQty[i] || "0");
//       const priceVal = parseFloat(
//         finalPriceWithoutTax[i] || finalPriceWithTax[i] || "0"
//       );
//       const amount = qtyVal * priceVal;
//       return encryptData(amount.toFixed(2))?.encryptedData;
//     });

//     const encryptedAdvanced = parseFloat(advancedAmount || "0");
//     const encryptedTotal = totalFinalAmount;

//     let balance = 0;
//     if (encryptedAdvanced === 0) {
//       balance = encryptedTotal;
//     } else if (encryptedAdvanced === encryptedTotal) {
//       balance = 0;
//     } else {
//       balance = encryptedTotal - encryptedAdvanced;
//     }

//     const newOrder = new saleOrder({
//       partyId,
//       Billingname: encryptData(Billingname)?.encryptedData,
//       PhnNo: encryptData(PhnNo)?.encryptedData,
//       OrderNO: encryptData(OrderNO)?.encryptedData,
//       OrderDate,
//       DueDate,
//       status: "order overdue",
//       stateofsupply,
//       item,
//       qty: encryptedQty,
//       unit,
//       pricePerUnit: {
//         withTax: encryptedPriceWithTax,
//         withoutTax: encryptedPriceWithoutTax,
//       },
//       taxRef,
//       tax: encryptData(totalGST.toFixed(2))?.encryptedData,
//       addCess: encryptedAddCess,
//       amount: encryptedAmountPerItem,
//       roundoff: encryptData("0")?.encryptedData,
//       overallDiscount: {
//         type: overallDiscount?.type,
//         value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//       },
//       totalAmount: encryptData(encryptedTotal.toFixed(2))?.encryptedData,
//       advancedAmount: encryptData(encryptedAdvanced.toFixed(2))?.encryptedData,
//       paymentType,
//       Description: encryptData(Description || "")?.encryptedData,
//       image,
//       type: "Sale Order",
//       action: ["convert to sale"],
//       balance: encryptData(balance.toFixed(2))?.encryptedData,
//     });

//     const saved = await newOrder.save();

// // store payment log here

//     await storePaymentLog({
//       partyId,
//       date: OrderDate,
//       type: "Sale Order",
//       total: totalFinalAmount.toFixed(2),
//       recievedOrPaid: encryptedAdvanced.toFixed(2),
//       balance: balance.toFixed(2),
//       paymentTypeId: paymentType,
//     });

//     //  STOCK UPDATE + STOCK LOGGING

//     const updatedProducts = [];
//     for (let i = 0; i < item.length; i++) {
//       const itemId = item[i];
//       const quantity = parseFloat(finalQty[i] || "0");
//       const price = parseFloat(
//         finalPriceWithoutTax[i] || finalPriceWithTax[i] || "0"
//       );

//       const product = await Productitem.findById(itemId);
//       if (!product) continue;

//       const oldReserved = parseFloat(product.stock.reservedQuantity || "0");
//       const oldAvailable = parseFloat(product.stock.availableForSale || "0");

//       const newReserved = oldReserved + quantity;
//       const newAvailable = Math.max(oldAvailable - quantity, 0);

//       product.stock.reservedQuantity = newReserved.toFixed(2);
//       product.stock.availableForSale = newAvailable.toFixed(2);
//       await product.save();

//       updatedProducts.push({
//         productId: itemId,
//         reservedQuantity: newReserved.toFixed(2),
//         availableForSale: newAvailable.toFixed(2),
//       });

//       await stocklogSchema.create({
//         type: "sale",
//         itemId,
//         godownId: product.Godownid,
//         referenceNo: OrderNO,
//         status: "Unpaid",
//         quantity,
//         pricePerUnit: price,
//         // userId: req?.user?._id || null,
//         date: new Date(),
//         editHistory: [],
//       });
//     }

//     await logEvent({
//       partyId,
//       insertId: saved._id,
//       type: "Sale Order",
//       event: "create",
//       data: {
//         totalAmount: totalFinalAmount.toFixed(2),
//         advancedAmount: encryptedAdvanced.toFixed(2),
//         balance: balance.toFixed(2),
//         status: "order overdue",
//       },
//     });

//     return res.status(201).json(
//       successResponse(201, "Sale order created successfully", null, true, {
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

export const createSaleOrder = async (req, res) => {
  try {
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      Billingname,
      PhnNo,
      OrderNO,
      OrderDate,
      DueDate,
      stateofsupply,
      productItem,
      overallDiscount,
      advancedAmount,
      paymentType,
      Description,
      image,
      type,
    } = decrypted;

    if (!Array.isArray(productItem)) {
      return res
        .status(400)
        .json(errorResponse(400, "productItem must be an array", false));
    }

    let totalFinalAmount = 0;
    let totalGST = 0;

    const calculateDiscount = (base) => {
      if (overallDiscount?.type === "amount") {
        return parseFloat(overallDiscount.value || "0");
      } else if (overallDiscount?.type === "percentage") {
        return (base * parseFloat(overallDiscount.value || "0")) / 100;
      }
      return 0;
    };

    const encryptedItems = [];
    const updatedProducts = [];

    for (const product of productItem) {
      const itemId = product.item[0]; // Assuming only one item per object
      const quantity = parseFloat(product.qty || "1");
      const cess = parseFloat(product.addCess || "0");
      const priceWithoutTax = parseFloat(
        product.pricePerUnit?.withoutTax || "0"
      );
      const priceWithTax = parseFloat(product.pricePerUnit?.withTax || "0");
      const taxRefs = product.taxRef || [];

      let gstRate = 0;
      for (const gstId of taxRefs) {
        const gst = await Gst.findById(gstId);
        if (gst && gst.rate) {
          const rateStr = decryptData(gst.rate).replace("%", "");
          gstRate += parseFloat(rateStr || "0");
        }
      }

      let baseAmount = 0;
      let subtotalAfterCess = 0;
      let afterDiscount = 0;
      let secondGST = 0;
      let finalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        const firstGST = (baseAmount * gstRate) / 100;
        subtotalAfterCess = baseAmount + firstGST + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        finalTotal = afterDiscount + secondGST;
      } else if (priceWithTax > 0) {
        baseAmount = quantity * priceWithTax;
        subtotalAfterCess = baseAmount + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        finalTotal = afterDiscount + secondGST;
      }

      totalFinalAmount += Math.round(finalTotal);
      totalGST += secondGST;

      // Update stock
      const productDoc = await Productitem.findById(itemId);
      if (productDoc) {
        const oldReserved = parseFloat(
          productDoc.stock.reservedQuantity || "0"
        );
        const oldAvailable = parseFloat(
          productDoc.stock.availableForSale || "0"
        );
        const newReserved = oldReserved + quantity;
        const newAvailable = Math.max(oldAvailable - quantity, 0);

        productDoc.stock.reservedQuantity = newReserved.toFixed(2);
        productDoc.stock.availableForSale = newAvailable.toFixed(2);
        await productDoc.save();

        updatedProducts.push({
          productId: itemId,
          reservedQuantity: newReserved.toFixed(2),
          availableForSale: newAvailable.toFixed(2),
        });

        await stocklogSchema.create({
          type: "sale",
          itemId,
          godownId: productDoc.Godownid,
          referenceNo: OrderNO,
          status: "Unpaid",
          quantity,
          pricePerUnit: priceWithoutTax > 0 ? priceWithoutTax : priceWithTax,
          date: new Date(),
          editHistory: [],
        });
      }

      // Store encrypted item data
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

    const newOrder = new saleOrder({
      partyId,
      Billingname: encryptData(Billingname)?.encryptedData,
      PhnNo: encryptData(PhnNo)?.encryptedData,
      OrderNO: encryptData(OrderNO)?.encryptedData,
      OrderDate,
      DueDate,
      status: "order overdue",
      stateofsupply,
      productItem: encryptedItems,
      overallDiscount: {
        type: overallDiscount?.type,
        value: encryptData(overallDiscount?.value || "0")?.encryptedData,
      },
      totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
      advancedAmount: encryptData(advAmt.toFixed(2))?.encryptedData,
      tax: encryptData(totalGST.toFixed(2))?.encryptedData,
      roundoff: encryptData("0")?.encryptedData,
      paymentType,
      Description: encryptData(Description || "")?.encryptedData,
      image,
      type: "Sale Order",
      action: ["convert to sale"],
      balance: encryptData(balance.toFixed(2))?.encryptedData,
    });

    const saved = await newOrder.save();

    await storePaymentLog({
      partyId,
      date: OrderDate,
      type: "Sale Order",
      total: totalFinalAmount.toFixed(2),
      recievedOrPaid: advAmt.toFixed(2),
      balance: balance.toFixed(2),
      paymentTypeId: paymentType,
    });

    await logEvent({
      partyId,
      insertId: saved._id,
      type: "Sale Order",
      event: "create",
      data: {
        totalAmount: totalFinalAmount.toFixed(2),
        advancedAmount: advAmt.toFixed(2),
        balance: balance.toFixed(2),
        status: "order overdue",
      },
    });

    return res.status(201).json(
      successResponse(201, "Sale order created successfully", null, true, {
        id: saved._id,
        updatedStock: updatedProducts,
      })
    );
  } catch (error) {
    console.error("Sale Order Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const updateSaleOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       Billingname,
//       PhnNo,
//       OrderNO,
//       OrderDate,
//       DueDate,
//       stateofsupply,
//       item,
//       qty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       totalAmount,
//       advancedAmount,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     const SaleOrder = await saleOrder.findById(id);
//     if (!SaleOrder) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Sale order not found", false));
//     }

//     const updatedFields = {};

//     updatedFields.status = "order overdue";

//     const finalTotal = parseFloat(totalAmount || "0");
//     const advance = parseFloat(advancedAmount || "0");

//     let balance = 0;
//     if (advance === 0) {
//       balance = finalTotal;
//     } else if (advance === finalTotal) {
//       balance = 0;
//     } else {
//       balance = finalTotal - advance;
//     }

//     const encryptField = (val) => encryptData(val || "")?.encryptedData;

//     updatedFields.partyId = partyId;
//     updatedFields.Billingname = encryptField(Billingname);
//     updatedFields.PhnNo = encryptField(PhnNo);
//     updatedFields.OrderNO = encryptField(OrderNO);
//     updatedFields.OrderDate = OrderDate;
//     updatedFields.DueDate = DueDate;
//     updatedFields.stateofsupply = stateofsupply;
//     updatedFields.item = item;
//     updatedFields.qty = qty?.map((q) => encryptField(q));
//     updatedFields.unit = unit;
//     updatedFields.pricePerUnit = {
//       withTax: pricePerUnit?.withTax?.map((p) => encryptField(p)) || [],
//       withoutTax: pricePerUnit?.withoutTax?.map((p) => encryptField(p)) || [],
//     };
//     updatedFields.taxRef = taxRef;
//     updatedFields.addCess = addCess?.map((c) => encryptField(c));
//     updatedFields.overallDiscount = {
//       type: overallDiscount?.type,
//       value: encryptField(overallDiscount?.value || "0"),
//     };
//     updatedFields.totalAmount = encryptField(totalAmount || "0");
//     updatedFields.advancedAmount = encryptField(advancedAmount || "0");
//     updatedFields.balance = encryptField(balance.toFixed(2));
//     updatedFields.paymentType = paymentType;
//     updatedFields.Description = encryptField(Description || "");
//     updatedFields.image = image;
//     updatedFields.type = type;

//     if (!Array.isArray(saleOrder.action)) {
//       saleOrder.action = [];
//     }
//     if (!saleOrder.action.includes("convert to sale")) {
//       updatedFields.action = [...saleOrder.action, "convert to sale"];
//     }

//     const updatedOrder = await saleOrder.findByIdAndUpdate(id, updatedFields, {
//       new: true,
//     });
//     await logEvent({
//       partyId,
//       insertId: updatedOrder._id,
//       type: "Sale Order",
//       event: "update",
//       data: {
//         totalAmount: finalTotal.toFixed(2),
//         advancedAmount: advance.toFixed(2),
//         balance: balance.toFixed(2),
//         status: "order overdue",
//       },
//     });
//     return res
//       .status(200)
//       .json(
//         successResponse(200, "Sale order updated", null, true, updatedOrder)
//       );
//   } catch (error) {
//     console.error("Update Sale Order Error:", error);
//     return res
//       .status(500)
//       .json(
//         errorResponse(
//           500,
//           "Something went wrong while updating Sale Order",
//           false
//         )
//       );
//   }
// };

// export const convertSaleOrderToSaleInvoice = async (req, res) => {
//   try {
//     const { body } = req.body;
//     if (!body || typeof body !== "string") {
//       return res.status(400).json({ success: false, message: "Invalid request body" });
//     }

//     const decrypted = JSON.parse(decryptData(body));
//     const { saleOrderId, paymentType, type, received } = decrypted;

//     const saleOrderData = await saleOrder.findById(saleOrderId).populate("partyId");
//     if (!saleOrderData) {
//       return res.status(404).json({ success: false, message: "Sale Order not found" });
//     }

//     const total = parseFloat(saleOrderData.totalAmount || "0");
//     const receivedAmount = parseFloat(received || "0");

//     let saleStatus = "unpaid";
//     if (receivedAmount >= total) saleStatus = "paid";
//     else if (receivedAmount > 0) saleStatus = "partially paid";

//     const today = new Date();
//  const balance = isNaN(total - receivedAmount) ? "0.00" : (total - receivedAmount).toFixed(2);

//     const newInvoice = new SaleInvoice({
//       partyId: saleOrderData.partyId._id,
//       Billingname: saleOrderData.Billingname,
//       InvoiceDate: today.toISOString().split("T")[0],
//       stateofsupply: saleOrderData.stateofsupply,
//       item: saleOrderData.item,
//       qty: saleOrderData.qty,
//       unit: saleOrderData.unit,
//       pricePerUnit: {
//         withTax: saleOrderData.pricePerUnit.withTax,
//         withoutTax: saleOrderData.pricePerUnit.withoutTax,
//       },
//       taxRef: saleOrderData.taxRef,
//       tax: saleOrderData.tax,
//       addCess: saleOrderData.addCess,
//       amount: saleOrderData.amount,
//       roundoff: saleOrderData.roundoff,
//       overallDiscount: saleOrderData.overallDiscount,
//       totalAmount: saleOrderData.totalAmount,
//       advancedAmount: saleOrderData.advancedAmount,
//       Description: saleOrderData.Description,
//       image: saleOrderData.image,
//       paymentType,
//       type,
//       recieved: receivedAmount.toFixed(2),
//       status: saleStatus,
//       balance: balance
//     });

//     const savedInvoice = await newInvoice.save();

//     saleOrderData.status = "order completed";
//     saleOrderData.action.push("convert to sale");
//     await saleOrderData.save();

//     await logEvent({
//       partyId: saleOrderData.partyId._id,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "convert",
//       data: {
//         saleOrderId: saleOrderData._id,
//         invoiceId: savedInvoice._id,
//         date: today.toISOString().split("T")[0],
//         amount: total.toFixed(2),
//         received: receivedAmount.toFixed(2),
//         balance,
//         status: "order completed",
//         paymentStatus: saleStatus
//       }
//     });

//     return res.status(200).json(successResponse(
//       200,
//       "Sale Order converted to Sale Invoice successfully",
//       null,
//       true,
//       savedInvoice
//     ));
//   } catch (err) {
//     console.error("Conversion Error:", err);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const updateSaleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      Billingname,
      PhnNo,
      OrderNO,
      OrderDate,
      DueDate,
      stateofsupply,
      productItem,
      overallDiscount,
      totalAmount,
      advancedAmount,
      paymentType,
      Description,
      image,
      type,
    } = decrypted;

    const SaleOrder = await saleOrder.findById(id);
    if (!SaleOrder) {
      return res
        .status(404)
        .json(errorResponse(404, "Sale order not found", false));
    }

    const encryptField = (val) => encryptData(val || "")?.encryptedData;

    const finalTotal = parseFloat(totalAmount || "0");
    const advance = parseFloat(advancedAmount || "0");

    let balance = 0;
    if (advance === 0) {
      balance = finalTotal;
    } else if (advance === finalTotal) {
      balance = 0;
    } else {
      balance = finalTotal - advance;
    }

    const encryptedProductItems = (productItem || []).map((p) => ({
      item: p.item,
      count: encryptField(p.count || "0"),
      qty: encryptField(p.qty || "0"),
      freeQty: encryptField(p.freeQty || "0"),
      unit: p.unit,
      pricePerUnit: {
        withTax: encryptField(p.pricePerUnit?.withTax || "0"),
        withoutTax: encryptField(p.pricePerUnit?.withoutTax || "0"),
      },
      taxRef: p.taxRef,
      addCess: encryptField(p.addCess || "0"),
      amount: encryptField(p.amount || "0"),
    }));

    const updatedFields = {
      partyId,
      Billingname: encryptField(Billingname),
      PhnNo: encryptField(PhnNo),
      OrderNO: encryptField(OrderNO),
      OrderDate,
      DueDate,
      status: "order overdue",
      stateofsupply,
      productItem: encryptedProductItems,
      overallDiscount: {
        type: overallDiscount?.type,
        value: encryptField(overallDiscount?.value || "0"),
      },
      totalAmount: encryptField(totalAmount || "0"),
      advancedAmount: encryptField(advancedAmount || "0"),
      balance: encryptField(balance.toFixed(2)),
      paymentType,
      Description: encryptField(Description || ""),
      image,
      type,
    };

    let currentActions = SaleOrder.action || [];
    if (!Array.isArray(currentActions)) currentActions = [];
    if (!currentActions.includes("convert to sale")) {
      updatedFields.action = [...currentActions, "convert to sale"];
    } else {
      updatedFields.action = currentActions;
    }

    const updatedOrder = await saleOrder.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    await logEvent({
      partyId,
      insertId: updatedOrder._id,
      type: "Sale Order",
      event: "update",
      data: {
        totalAmount: finalTotal.toFixed(2),
        advancedAmount: advance.toFixed(2),
        balance: balance.toFixed(2),
        status: "order overdue",
      },
    });

    return res
      .status(200)
      .json(successResponse(200, "Sale order updated", updatedOrder, true));
  } catch (error) {
    console.error("Update Sale Order Error:", error);
    return res
      .status(500)
      .json(
        errorResponse(
          500,
          "Something went wrong while updating Sale Order",
          false
        )
      );
  }
};

// export const convertSaleOrderToSaleInvoice = async (req, res) => {
//   try {
//     const { body } = req.body;
//     if (!body || typeof body !== "string") {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid request body" });
//     }

//     const decrypted = JSON.parse(decryptData(body));
//     const { saleOrderId, paymentType, type, received } = decrypted;

//     const saleOrderData = await saleOrder
//       .findById(saleOrderId)
//       .populate("partyId");
//     if (!saleOrderData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Sale Order not found" });
//     }

//     const total = parseFloat(saleOrderData.totalAmount || "0");
//     const receivedAmount = parseFloat(received || "0");

//     let saleStatus = "unpaid";
//     if (receivedAmount >= total) saleStatus = "paid";
//     else if (receivedAmount > 0) saleStatus = "partially paid";

//     const today = new Date();
//     const balance = isNaN(total - receivedAmount)
//       ? "0.00"
//       : (total - receivedAmount).toFixed(2);

//     // Create sale invoice
//     const newInvoice = new SaleInvoice({
//       partyId: saleOrderData.partyId._id,
//       Billingname: saleOrderData.Billingname,
//       InvoiceDate: today.toISOString().split("T")[0],
//       stateofsupply: saleOrderData.stateofsupply,
//       item: saleOrderData.item,
//       qty: saleOrderData.qty,
//       unit: saleOrderData.unit,
//       pricePerUnit: {
//         withTax: saleOrderData.pricePerUnit.withTax,
//         withoutTax: saleOrderData.pricePerUnit.withoutTax,
//       },
//       taxRef: saleOrderData.taxRef,
//       tax: saleOrderData.tax,
//       addCess: saleOrderData.addCess,
//       amount: saleOrderData.amount,
//       roundoff: saleOrderData.roundoff,
//       overallDiscount: saleOrderData.overallDiscount,
//       totalAmount: saleOrderData.totalAmount,
//       advancedAmount: saleOrderData.advancedAmount,
//       Description: saleOrderData.Description,
//       image: saleOrderData.image,
//       paymentType,
//       type,
//       recieved: receivedAmount.toFixed(2),
//       status: saleStatus,
//       balance: balance,
//     });

//     const savedInvoice = await newInvoice.save();

//     saleOrderData.status = "order completed";
//     saleOrderData.action.push("convert to sale");
//     await saleOrderData.save();

//     const updatedStocks = [];
//     for (const soldItem of saleOrderData.item) {
//       const product = await Productitem.findById(soldItem.productId);
//       if (!product) continue;

//       const qtySold = parseFloat(soldItem.qty);
//       const currentStockQty = parseFloat(product.stock.stockQuantity || "0");
//       const currentStockValue = parseFloat(product.stock.stockValue || "0");
//       const pricePerUnit = parseFloat(soldItem.pricePerUnit?.withoutTax || "0");

//       const newStockQty = currentStockQty - qtySold;
//       const newStockValue = currentStockValue - qtySold * pricePerUnit;

//       product.stock.stockQuantity = newStockQty.toString();
//       product.stock.stockValue = newStockValue.toFixed(2).toString();

//       await product.save();

//       let stockLogStatus = saleStatus;
//       if (stockLogStatus === "partially paid") {
//         stockLogStatus = "unpaid";
//       }

//       await stocklogSchema.create({
//         productId: product._id,
//         quantity: qtySold.toString(),
//         status: stockLogStatus,
//         type: "sale",
//         refId: savedInvoice._id,
//         date: today,
//       });
//       updatedStocks.push({
//         productId: product._id,
//         stockQuantity: product.stock.stockQuantity,
//         stockValue: product.stock.stockValue,
//       });
//     }
// await paymentlogmodel.create({
//       partyId: saleOrderData.partyId._id,
//       date: today,
//       amount: receivedAmount.toFixed(2),
//       paymentType,
//       type: "sale", // Updated type to "sale"
//       refId: savedInvoice._id,
//       description: "Payment received during sale conversion",
//     });
//      await Party.findByIdAndUpdate(saleOrderData.partyId._id, {
//       $push: {
//         logs: {
//           type: "sale",
//           date: today,
//           amount: receivedAmount.toFixed(2),
//           description: "Sale order converted to sale invoice",
//           refId: savedInvoice._id,
//         },
//       },
//     });
//     await logEvent({
//       partyId: saleOrderData.partyId._id,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "convert",
//       data: {
//         saleOrderId: saleOrderData._id,
//         invoiceId: savedInvoice._id,
//         date: today.toISOString().split("T")[0],
//         amount: total.toFixed(2),
//         received: receivedAmount.toFixed(2),
//         balance,
//         status: "order completed",
//         paymentStatus: saleStatus,
//       },
//     });

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Sale Order converted to Sale Invoice successfully",
//           null,
//           true,
//           { invoice: savedInvoice, updatedStocks }
//         )
//       );
//   } catch (err) {
//     console.error("Conversion Error:", err);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const convertSaleOrderToSaleInvoice = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body || typeof body !== "string") {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid request body", false));
    }

    const decrypted = JSON.parse(decryptData(body));
    const { saleOrderId, paymentType, type, received } = decrypted;

    const saleOrderData = await saleOrder
      .findById(saleOrderId)
      .populate("partyId")
      .populate("productItem.item")
      .populate("productItem.unit")
      .populate("productItem.taxRef");

    if (!saleOrderData) {
      return res
        .status(404)
        .json(errorResponse(404, "Sale Order not found", false));
    }

    const total = parseFloat(saleOrderData.totalAmount || "0");
    const receivedAmount = parseFloat(received || "0");

    let saleStatus = "unpaid";
    if (receivedAmount >= total) saleStatus = "paid";
    else if (receivedAmount > 0) saleStatus = "partially paid";

    const today = new Date();
    const balance = isNaN(total - receivedAmount)
      ? "0.00"
      : (total - receivedAmount).toFixed(2);

    // Create sale invoice
    const newInvoice = new SaleInvoice({
      partyId: saleOrderData.partyId?._id,
      Billingname: saleOrderData.Billingname,
      InvoiceDate: today.toISOString().split("T")[0],
      stateofsupply: saleOrderData.stateofsupply,
      item: saleOrderData.productItem,

      taxRef: saleOrderData.taxRef,
      tax: saleOrderData.tax,
      addCess: saleOrderData.addCess,
      amount: saleOrderData.amount,
      roundoff: saleOrderData.roundoff,
      overallDiscount: saleOrderData.overallDiscount,
      totalAmount: saleOrderData.totalAmount,
      advancedAmount: saleOrderData.advancedAmount,
      Description: saleOrderData.Description,
      image: saleOrderData.image,
      paymentType,
      type,
      recieved: receivedAmount.toFixed(2),
      status: saleStatus,
      balance: balance,
    });

    const savedInvoice = await newInvoice.save();

    saleOrderData.status = "order completed";
    saleOrderData.action.push("convert to sale");
    await saleOrderData.save();

    const updatedStocks = [];

    for (const soldItem of saleOrderData.productItem) {
      for (const productId of soldItem.item) {
        const product = await Productitem.findById(productId);
        if (!product) continue;

        const qtySold = parseFloat(soldItem.qty || "0");
        const currentStockQty = parseFloat(product.stock.stockQuantity || "0");
        const currentStockValue = parseFloat(product.stock.stockValue || "0");
        const pricePerUnit = parseFloat(
          soldItem.pricePerUnit?.withoutTax || "0"
        );

        const newStockQty = currentStockQty - qtySold;
        const newStockValue = currentStockValue - qtySold * pricePerUnit;

        product.stock.stockQuantity = newStockQty.toString();
        product.stock.stockValue = newStockValue.toFixed(2).toString();

        await product.save();

        let stockLogStatus = saleStatus;
        if (stockLogStatus === "partially paid") {
          stockLogStatus = "unpaid";
        }

        await stocklogSchema.create({
          productId: product._id,
          quantity: qtySold.toString(),
          status: stockLogStatus,
          type: "sale",
          refId: savedInvoice._id,
          date: today,
        });
        updatedStocks.push({
          productId: product._id,
          stockQuantity: product.stock.stockQuantity,
          stockValue: product.stock.stockValue,
        });
      }
    }

    await paymentlogmodel.create({
      partyId: saleOrderData.partyId?._id,
      date: today,
      amount: receivedAmount.toFixed(2),
      paymentType,
      type: "sale",
      refId: savedInvoice._id,
      description: "Payment received during sale conversion",
    });

    await Party.findByIdAndUpdate(saleOrderData.partyId?._id, {
      $push: {
        logs: {
          type: "sale",
          date: today,
          amount: receivedAmount.toFixed(2),
          description: "Sale order converted to sale invoice",
          refId: savedInvoice._id,
        },
      },
    });

    await logEvent({
      partyId: saleOrderData.partyId?._id,
      insertId: savedInvoice._id,
      type: "sale",
      event: "convert",
      data: {
        saleOrderId: saleOrderData._id,
        invoiceId: savedInvoice._id,
        date: today.toISOString().split("T")[0],
        amount: total.toFixed(2),
        received: receivedAmount.toFixed(2),
        balance,
        status: "order completed",
        paymentStatus: saleStatus,
      },
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Sale Order converted to Sale Invoice successfully",
          { invoice: savedInvoice, updatedStocks },
          true
        )
      );
  } catch (err) {
    console.error("Conversion Error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const getAllSaleOrders = async (req, res) => {
//   try {
//     const orders = await saleOrder
//       .find()
//       .populate("partyId")
//       .populate("taxRef")
//       .populate("unit")
//       .populate({
//         path: "item",
//         populate: [
//           { path: "selectUnit.baseUnit", model: "PrimaryUnit" },
//           { path: "selectUnit.secondaryUnit", model: "SecondaryUnit" },
//           { path: "category", model: "CategoryItem" },
//           { path: "Godownid", model: "Godown" },
//           { path: "pricing.taxRate", model: "Gst" },
//           { path: "userId", model: "User" },
//         ],
//       })
//       .populate("paymentType")
//       .sort({ createdAt: -1 });

//     const decryptedOrders = orders.map((order) => ({
//       _id: order._id,
//       party: order.partyId
//         ? {
//             _id: order.partyId._id,
//             name: order.partyId.name ? decryptData(order.partyId.name) : null,
//             email: order.partyId.email
//               ? decryptData(order.partyId.email)
//               : null,
//             phone: order.partyId.phone
//               ? decryptData(order.partyId.phone)
//               : null,
//             gstIn: order.partyId.gstIn
//               ? decryptData(order.partyId.gstIn)
//               : null,
//           }
//         : null,
//       Billingname: order.Billingname ? decryptData(order.Billingname) : null,
//       PhnNo: order.PhnNo ? decryptData(order.PhnNo) : null,
//       OrderNO: order.OrderNO ? decryptData(order.OrderNO) : null,
//       OrderDate: order.OrderDate,
//       DueDate: order.DueDate,
//       stateofsupply: order.stateofsupply,
//       status: order.status,
//       item: order.item?.map((itm) => ({
//         _id: itm._id,
//         itemName: itm.itemName ? decryptData(itm.itemName) : null,
//         itemHSN: itm.itemHSN ? decryptData(itm.itemHSN) : null,
//         itemCode: itm.itemCode,

//         // Populated fields from nested references
//         selectUnit: {
//           baseUnit: itm.selectUnit?.baseUnit
//             ? {
//                 _id: itm.selectUnit.baseUnit._id,
//                 name: itm.selectUnit.baseUnit.name
//                   ? decryptData(itm.selectUnit.baseUnit.name)
//                   : null,
//               }
//             : null,
//           secondaryUnit: itm.selectUnit?.secondaryUnit
//             ? {
//                 _id: itm.selectUnit.secondaryUnit._id,
//                 name: itm.selectUnit.secondaryUnit.name
//                   ? decryptData(itm.selectUnit.secondaryUnit.name)
//                   : null,
//               }
//             : null,
//           conversionRate: itm.selectUnit?.conversionRate,
//         },

//         itemImage: itm.itemImage || null,

//         category: itm.category
//           ? {
//               _id: itm.category._id,
//               name: itm.category.name ? decryptData(itm.category.name) : null,
//             }
//           : null,

//         Godownid: itm.Godownid
//           ? {
//               _id: itm.Godownid._id,
//               name: itm.Godownid.name ? decryptData(itm.Godownid.name) : null,
//             }
//           : null,

//         pricing: {
//           salePrice: {
//             withTax: itm.pricing.salePrice?.withTax,
//             withoutTax: itm.pricing.salePrice?.withoutTax,
//             discount: {
//               type: itm.pricing.salePrice?.discount?.type || null,
//               value: itm.pricing.salePrice?.discount?.value || null,
//             },
//           },
//           purchasePrice: {
//             withTax: itm.pricing.purchasePrice?.withTax,
//             withoutTax: itm.pricing.purchasePrice?.withoutTax,
//           },
//           taxRate: itm.pricing.taxRate
//             ? {
//                 _id: itm.pricing.taxRate._id,
//                 label: itm.pricing.taxRate.label
//                   ? decryptData(itm.pricing.taxRate.label)
//                   : null,
//                 rate: itm.pricing.taxRate.rate
//                   ? decryptData(itm.pricing.taxRate.rate)
//                   : null,
//               }
//             : null,
//         },

//         stock: itm.stock || null,

//         onlineStore: itm.onlineStore || null,

//         user: itm.userId
//           ? {
//               _id: itm.userId._id,
//               name: itm.userId.name ? decryptData(itm.userId.name) : null,
//               email: itm.userId.email ? decryptData(itm.userId.email) : null,
//             }
//           : null,

//         date: itm.date || null,
//       })),
//       qty: order.qty?.map(decryptData),
//       unit: order.unit?.map((u) => ({
//         _id: u._id,
//         name: u.name ? decryptData(u.name) : null,
//         status: u.status,
//       })),
//       pricePerUnit: {
//         withTax: order.pricePerUnit.withTax?.map(decryptData),
//         withoutTax: order.pricePerUnit.withoutTax?.map(decryptData),
//       },
//       taxRef: order.taxRef?.map((gst) => ({
//         _id: gst._id,
//         label: gst.label ? decryptData(gst.label) : null,
//         rate: gst.rate ? decryptData(gst.rate) : null,
//       })),
//       tax: order.tax ? decryptData(order.tax) : null,
//       addCess: order.addCess?.map(decryptData),
//       amount: order.amount?.map(decryptData),
//       roundoff: order.roundoff ? decryptData(order.roundoff) : null,
//       overallDiscount: {
//         type: order.overallDiscount?.type,
//         value: order.overallDiscount?.value
//           ? decryptData(order.overallDiscount.value)
//           : null,
//       },
//       totalAmount: order.totalAmount ? decryptData(order.totalAmount) : null,
//       advancedAmount: order.advancedAmount
//         ? decryptData(order.advancedAmount)
//         : null,
//       balance: order.balance ? decryptData(order.balance) : null,
//       paymentType: order.paymentType
//         ? {
//             _id: order.paymentType._id,
//             name: order.paymentType.name
//               ? decryptData(order.paymentType.name)
//               : null,
//           }
//         : null,
//       Description: order.Description ? decryptData(order.Description) : null,
//       image: order.image,
//       type: order.type,
//       action: order.action,
//       createdAt: order.createdAt,
//       updatedAt: order.updatedAt,
//     }));

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Sale orders fetched successfully",
//           "",
//           true,
//           decryptedOrders
//         )
//       );
//   } catch (error) {
//     console.error("Get All Sale Orders Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const getAllSaleOrders = async (req, res) => {
  try {
    // Helper to safely decrypt only if value is a non-empty string
    const safeDecrypt = (val) =>
      typeof val === "string" && val ? decryptData(val) : null;

    const saleOrders = await saleOrder
      .find()
      .populate("partyId", "partyName")
      .populate("productItem.item", "itemName")
      .populate("productItem.unit", "sortName unitName")
      .populate("productItem.taxRef", "rate label")
      .populate("paymentType", "name")
      .exec();

    if (!saleOrders || saleOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sale orders found",
      });
    }

    const decryptedOrders = saleOrders.map((order) => ({
      id: order._id,
      partyId: order.partyId
        ? {
            _id: order.partyId._id,
            partyName: safeDecrypt(order.partyId.partyName),
          }
        : null,
      Billingname: safeDecrypt(order.Billingname),
      PhnNo: safeDecrypt(order.PhnNo),
      OrderNO: safeDecrypt(order.OrderNO),
      OrderDate: order.OrderDate,
      DueDate: order.DueDate,
      status: order.status,
      stateofsupply: order.stateofsupply,
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
      overallDiscount: {
        type: order.overallDiscount?.type,
        value: safeDecrypt(order.overallDiscount?.value),
      },
      totalAmount: safeDecrypt(order.totalAmount),
      advancedAmount: safeDecrypt(order.advancedAmount),
      paymentType: order.paymentType
        ? {
            _id: order.paymentType._id,
            name: safeDecrypt(order.paymentType.name),
          }
        : null,
      Description: safeDecrypt(order.Description),
      image: safeDecrypt(order.image),
      tax: safeDecrypt(order.tax),
      type: order.type,
    }));

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Sale orders fetched successfully",
          "",
          true,
          decryptedOrders
        )
      );
  } catch (error) {
    console.error("Get All Sale Orders Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const deleteSaleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOrder = await saleOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Sale order not found",
      });
    }

    await saleOrder.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Sale order deleted successfully",
    });
  } catch (error) {
    console.error("Delete Sale Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting sale order",
    });
  }
};
