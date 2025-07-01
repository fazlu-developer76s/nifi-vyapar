import Gst from "../models/Gst.js";
import { decryptData, encryptData } from "../lib/encrypt.js";
import { successResponse, errorResponse } from "../lib/reply.js";
import EstimateQuotation from "../models/EstimateQuaotation.js";
import SaleInvoice from "../models/SaleInvoice.js";
import mongoose from "mongoose";
import { logEvent } from "../utils/Logsfile.js";
import moment from "moment";
import saleOrder from "../models/saleOrder.js";
import paymentlogmodel from "../models/paymentlogmodel.js";

// export const createEstimateQuotation = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       billingName,
//       refNo,
//       invoiceDate,
//       stateOfSupply,
//       status = "open",
//       action,
//       event,
//       item,
//       qty,
//       freeQty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       description,
//       image,
//     } = decrypted;

//     const quantity = parseFloat(qty || "1");
//     const cess = parseFloat(addCess || "0");
//     const priceWithoutTax = parseFloat(pricePerUnit?.withoutTax || "0");
//     const priceWithTax = parseFloat(pricePerUnit?.withTax || "0");

//     // Fetch GST % from taxRef
//     let gstRate = 0;
//     const gst = await Gst.findById(taxRef);
//     if (gst && gst.rate) {
//       const rateStr = decryptData(gst.rate)?.replace("%", "");
//       gstRate = parseFloat(rateStr || "0");
//     }

//     // --- Discount Logic ---
//     let discountAmount = 0
//     const calculateDiscount = (base) => {
//       if (overallDiscount?.type === "amount") {
//         return parseFloat(overallDiscount.value || "0");
//       } else if (overallDiscount?.type === "percentage") {
//         return (base * parseFloat(overallDiscount.value || "0")) / 100;
//       }
//       return 0;
//     };

//     let baseAmount = 0;
//     let firstGST = 0;
//     let subtotalAfterCess = 0;
//     let afterDiscount = 0;
//     let secondGST = 0;
//     let finalTotal = 0;

//     if (priceWithoutTax > 0) {
//       baseAmount = quantity * priceWithoutTax;
//       firstGST = (baseAmount * gstRate) / 100;
//       subtotalAfterCess = baseAmount + firstGST + cess;
//       const discountAmount = calculateDiscount(subtotalAfterCess);
//       afterDiscount = subtotalAfterCess - discountAmount;
//       secondGST = (afterDiscount * gstRate) / 100;
//       finalTotal = afterDiscount + secondGST;
//     } else if (priceWithTax > 0) {
//       baseAmount = quantity * priceWithTax;
//       subtotalAfterCess = baseAmount + cess;
//       const discountAmount = calculateDiscount(subtotalAfterCess);
//       afterDiscount = subtotalAfterCess - discountAmount;
//       secondGST = (afterDiscount * gstRate) / 100;
//       finalTotal = afterDiscount + secondGST;
//     }

//     const roundedTotal = Math.round(finalTotal);
//     const roundOff = parseFloat((roundedTotal - finalTotal).toFixed(2));

//     // Save to DB
//     const newEstimate = new EstimateQuotation({
//       partyId,
//       billingName: encryptData(billingName)?.encryptedData,
//       refNo: encryptData(refNo)?.encryptedData,
//       invoiceDate,
//       stateOfSupply,
//       status: "Quotation open",
//       action: ["convert to sale", "convert to sale order"],
//       event,
//       item,
//       qty: encryptData(qty)?.encryptedData,
//       freeQty: encryptData(freeQty)?.encryptedData,
//       unit,
//       pricePerUnit: {
//         withTax: encryptData(pricePerUnit?.withTax || "0")?.encryptedData,
//         withoutTax: encryptData(pricePerUnit?.withoutTax || "0")?.encryptedData,
//       },
//       taxRef,
//       tax: encryptData(secondGST.toFixed(2))?.encryptedData,
//       addCess: encryptData(addCess || "0")?.encryptedData,
//       amount: encryptData(baseAmount.toFixed(2))?.encryptedData,
//       roundOff: encryptData(roundOff.toFixed(2))?.encryptedData,
//       overallDiscount: {
//         type: overallDiscount?.type,
//         value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//       },
//       totalAmount: encryptData(roundedTotal.toFixed(2))?.encryptedData,
//       description: encryptData(description || "")?.encryptedData,
//       image: encryptData(image)?.encryptedData,
//     });

//     const saved = await newEstimate.save();
//   await logEvent({
//       partyId,
//       insertId: saved._id,
//       type: "Estimate Quotation",
//       event: "create",
//       data: {
//         status: "Quotation open",
//         totalAmount: roundedTotal,
//         roundOff,
//         tax: secondGST.toFixed(2),
//         description,
//       },
//     });
//     return res
//       .status(201)
//       .json(
//         successResponse(201, "Estimate Quotation created successfully", null, true, {
//           id: saved._id,
//         })
//       );
//   } catch (error) {
//     console.error("Error creating EstimateQuotation:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, error.message, false));
//   }
// };

export const createEstimateQuotation = async (req, res) => {
  try {
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      billingName,
      refNo,
      invoiceDate,
      stateOfSupply,
      status = "Quotation open",
      action = ["convert to sale", "convert to sale order"],
      event,
      productItem = [],
      overallDiscount,
      description,
      image,
      userId,
    } = decrypted;

    let totalAmount = 0;
    let totalGST = 0;
    let roundOff = 0;

    const processedItems = [];

    for (const item of productItem) {
      const {
        item: itemIds,
        count,
        qty,
        freeQty,
        unit,
        pricePerUnit,
        taxRef,
        addCess = "0",
      } = item;
      let unitArray = [];

      if (Array.isArray(unit)) {
        unitArray = unit.filter((u) => mongoose.Types.ObjectId.isValid(u));
      } else if (typeof unit === "string") {
        if (
          unit.toUpperCase() !== "NONE" &&
          mongoose.Types.ObjectId.isValid(unit)
        ) {
          unitArray = [unit];
        }
      }
      const quantity = parseFloat(qty || "1");
      const cess = parseFloat(addCess);
      const priceWithoutTax = parseFloat(pricePerUnit?.withoutTax || "0");
      const priceWithTax = parseFloat(pricePerUnit?.withTax || "0");

      let gstRate = 0;
      const gst = await Gst.findById(taxRef[0]);
      if (gst && gst.rate) {
        const rateStr = decryptData(gst.rate)?.replace("%", "");
        gstRate = parseFloat(rateStr || "0");
      }

      const calculateDiscount = (base) => {
        if (overallDiscount?.type === "amount") {
          return parseFloat(overallDiscount.value || "0");
        } else if (overallDiscount?.type === "percentage") {
          return (base * parseFloat(overallDiscount.value || "0")) / 100;
        }
        return 0;
      };

      let baseAmount = 0;
      let firstGST = 0;
      let subtotalAfterCess = 0;
      let afterDiscount = 0;
      let secondGST = 0;
      let itemFinalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        firstGST = (baseAmount * gstRate) / 100;
        subtotalAfterCess = baseAmount + firstGST + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        itemFinalTotal = afterDiscount + secondGST;
      } else if (priceWithTax > 0) {
        baseAmount = quantity * priceWithTax;
        subtotalAfterCess = baseAmount + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        itemFinalTotal = afterDiscount + secondGST;
      }

      totalGST += secondGST;
      totalAmount += itemFinalTotal;

      processedItems.push({
        item: itemIds,
        count,
        qty: encryptData(qty)?.encryptedData,
        freeQty: encryptData(freeQty)?.encryptedData,
        unit: unitArray,
        pricePerUnit: {
          withTax: encryptData(pricePerUnit?.withTax || "0")?.encryptedData,
          withoutTax: encryptData(pricePerUnit?.withoutTax || "0")
            ?.encryptedData,
        },
        taxRef,
        addCess: encryptData(addCess || "0")?.encryptedData,
        amount: encryptData(baseAmount.toFixed(2))?.encryptedData,
      });
    }

    const roundedTotal = Math.round(totalAmount);
    roundOff = parseFloat((roundedTotal - totalAmount).toFixed(2));

    const newEstimate = new EstimateQuotation({
      partyId,
      billingName: encryptData(billingName)?.encryptedData,
      refNo: encryptData(refNo)?.encryptedData,
      invoiceDate,
      stateOfSupply,
      status,
      action,
      event,
      productItem: processedItems,
      roundOff: encryptData(roundOff.toFixed(2))?.encryptedData,
      overallDiscount: {
        type: overallDiscount?.type,
        value: encryptData(overallDiscount?.value || "0")?.encryptedData,
      },
      totalAmount: encryptData(roundedTotal.toFixed(2))?.encryptedData,
      description: encryptData(description || "")?.encryptedData,
      image: encryptData(image)?.encryptedData,
      balanceDue: encryptData(roundedTotal.toFixed(2))?.encryptedData,
      userId,
    });

    const saved = await newEstimate.save();

    await paymentlogmodel.create({
      party: partyId,
      date: new Date(invoiceDate),
      type: "Estimate Quotation",
      total: roundedTotal.toFixed(2),
      recievedorpaid: "pending",
      Balance: roundedTotal.toFixed(2),
      paymentType: null,
      refNo: encryptData(refNo)?.encryptedData,
      estimateId: saved._id,
    });

    await logEvent({
      partyId,
      insertId: saved._id,
      type: "Estimate Quotation",
      event: "create",
      data: {
        status,
        totalAmount: roundedTotal,
        roundOff,
        tax: totalGST.toFixed(2),
        description,
      },
    });

    return res.status(201).json(
      successResponse(
        201,
        "Estimate Quotation created successfully",
        null,
        true,
        {
          id: saved._id,
        }
      )
    );
  } catch (error) {
    console.error("Error creating EstimateQuotation:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

// export const getAllEstimateQuotations = async (req, res) => {
//   try {
//     // Fetch all estimate quotations and populate the referenced fields
//     const quotations = await EstimateQuotation.find()
//       .populate("partyId", "partyName") // Populate partyId (replace 'name' with the fields you need)
//       .populate("item", "itemName") // Populate item (replace with the fields you need)
//       .populate("unit", "sortName unitName") // Populate unit (replace with the fields you need)
//       .populate("taxRef", "rate label") // Populate taxRef (replace with the fields you need)
//       .exec();
//     console.log(quotations, "what is this");
//     if (!quotations || quotations.length === 0) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "", false, "quutations r required"));
//     }

//     // Decrypt fields and format the response
//     const decryptedQuotations = quotations.map((quotation) => {
//       return {
//         id: quotation._id,
//         partyId: quotation.partyId,
//         partyId: quotation.partyId
//           ? {
//               _id: quotation.partyId._id,
//               partyName:quotation.partyId.partyName? decryptData(quotation.partyId.partyName):null,
//             }
//           : null,

//         billingName: decryptData(quotation.billingName),
//         refNo: decryptData(quotation.refNo),
//         invoiceDate: quotation.invoiceDate,
//         stateOfSupply: quotation.stateOfSupply,
//         status: quotation.status,
//         action: quotation.action,
//         event: quotation.event,
//         item: quotation.item,

//         item: quotation.item,
//         item:
//           quotation.item?.map((itm) => ({
//             _id: itm._id,
//             itemName: decryptData(itm.itemName),
//           })) || [],
//         qty: decryptData(quotation.qty),
//         freeQty: decryptData(quotation.freeQty),

//          unit:
//           quotation.unit?.map((uni) => ({
//             _id: uni._id,
//             sortName:uni.sortName? decryptData(uni.sortName):null,
//             unitName:uni.unitName? decryptData(uni.unitName):null
//           })) || [],
//         pricePerUnit: {
//           withTax: decryptData(quotation.pricePerUnit?.withTax),
//           withoutTax: decryptData(quotation.pricePerUnit?.withoutTax)
//         },

//         tax: decryptData(quotation.tax),
//          taxRef:
//           quotation.taxRef?.map((tax) => ({
//             _id: tax._id,
//             rate:tax.rate? decryptData(tax.rate):null,
//             label:tax.label? decryptData(tax.label):null,
//           })) || [],

//         addCess: decryptData(quotation.addCess),
//         amount: decryptData(quotation.amount),
//         roundOff: decryptData(quotation.roundOff),
//         overallDiscount: {
//           type: quotation.overallDiscount?.type,
//           value: decryptData(quotation.overallDiscount?.value),
//         },
//         totalAmount: decryptData(quotation.totalAmount),
//         description: decryptData(quotation.description),
//         image: decryptData(quotation.image),
//       };
//     });

//     // Return the decrypted estimate quotations in the response
//     //
//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "get Data Succesfully",
//           "",
//           true,
//           decryptedQuotations
//         )
//       );
//   } catch (error) {
//     console.error("Error fetching Estimate Quotations:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };


export const getAllEstimateQuotations = async (req, res) => {
  try {
    const quotations = await EstimateQuotation.find({})
      .populate("partyId", "partyName")
      .populate("productItem.item", "itemName")
      .populate("productItem.unit", "sortName unitName")
      .populate("productItem.taxRef", "rate label");

    const formattedQuotations = quotations.map((quotation) => ({
      id: quotation._id,
      partyId: quotation.partyId
        ? {
            _id: quotation.partyId._id,
            partyName: decryptData(quotation.partyId.partyName),
          }
        : null,
      billingName: decryptData(quotation.billingName),
      refNo: decryptData(quotation.refNo),
      invoiceDate:quotation.invoiceDate && !isNaN(new Date(quotation.invoiceDate))
    ? quotation.invoiceDate
    : null,
      status: quotation.status,
      action: ["convert to sale", "convert to sale order"],
      productItem: quotation.productItem.map((prod) => ({
        item: Array.isArray(prod.item)
          ? prod.item.map((itm) => ({
              _id: itm._id,
              itemName:
                typeof itm.itemName === "string"
                  ? decryptData(itm.itemName)
                  : itm.itemName,
            }))
          : [],

        qty:
          typeof prod.qty === "string" ? decryptData(prod.qty) : prod.qty,

        freeQty:
          typeof prod.freeQty === "string"
            ? decryptData(prod.freeQty)
            : prod.freeQty,

        unit: Array.isArray(prod.unit)
          ? prod.unit.map((uni) => ({
              _id: uni._id,
              sortName:
                typeof uni.sortName === "string"
                  ? decryptData(uni.sortName)
                  : uni.sortName,
              unitName:
                typeof uni.unitName === "string"
                  ? decryptData(uni.unitName)
                  : uni.unitName,
            }))
          : [],

        pricePerUnit: {
          withTax:
            typeof prod.pricePerUnit?.withTax === "string"
              ? decryptData(prod.pricePerUnit.withTax)
              : prod.pricePerUnit?.withTax,
          withoutTax:
            typeof prod.pricePerUnit?.withoutTax === "string"
              ? decryptData(prod.pricePerUnit.withoutTax)
              : prod.pricePerUnit?.withoutTax,
        },

        taxRef: Array.isArray(prod.taxRef)
          ? prod.taxRef.map((tax) => ({
              _id: tax._id,
              rate:
                typeof tax.rate === "string"
                  ? decryptData(tax.rate)
                  : tax.rate,
              label:
                typeof tax.label === "string"
                  ? decryptData(tax.label)
                  : tax.label,
            }))
          : [],

        addCess:
          typeof prod.addCess === "string"
            ? decryptData(prod.addCess)
            : prod.addCess,

        amount:
          typeof prod.amount === "string"
            ? decryptData(prod.amount)
            : prod.amount,
      })),
      roundOff:
        typeof quotation.roundOff === "string"
          ? decryptData(quotation.roundOff)
          : quotation.roundOff,
      overallDiscount: quotation.overallDiscount,
      totalAmount:
        typeof quotation.totalAmount === "string"
          ? decryptData(quotation.totalAmount)
          : quotation.totalAmount,
      description:
        typeof quotation.description === "string"
          ? decryptData(quotation.description)
          : quotation.description,
      balanceDue:
        typeof quotation.balanceDue === "string"
          ? decryptData(quotation.balanceDue)
          : quotation.balanceDue,
    }));

    return res.status(200).json(successResponse(200, "Estimate Quotations fetched successfully", "", true ,formattedQuotations));
 
  } catch (error) {
    console.error("Error fetching estimate quotations:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


// export const updateEstimateQuotation = async (req, res) => {
//   try {
//     const { id } = req.params; // Get ID from URL
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       billingName,
//       refNo,
//       invoiceDate,
//       stateOfSupply,
//       status,
//       action,
//       event,
//       item,
//       qty,
//       freeQty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       description,
//       image,
//     } = decrypted;

//     const quantity = parseFloat(qty || "1");
//     const cess = parseFloat(addCess || "0");
//     const priceWithoutTax = parseFloat(pricePerUnit?.withoutTax || "0");
//     const priceWithTax = parseFloat(pricePerUnit?.withTax || "0");

//     // Fetch GST Rate
//     let gstRate = 0;
//     const gst = await Gst.findById(taxRef);
//     if (gst?.rate) {
//       const rateStr = decryptData(gst.rate)?.replace("%", "");
//       gstRate = parseFloat(rateStr || "0");
//     }

//     const calculateDiscount = (base) => {
//       if (overallDiscount?.type === "amount") {
//         return parseFloat(overallDiscount.value || "0");
//       } else if (overallDiscount?.type === "percentage") {
//         return (base * parseFloat(overallDiscount.value || "0")) / 100;
//       }
//       return 0;
//     };

//     let baseAmount = 0;
//     let subtotalAfterCess = 0;
//     let afterDiscount = 0;
//     let secondGST = 0;
//     let finalTotal = 0;

//     if (priceWithoutTax > 0) {
//       baseAmount = quantity * priceWithoutTax;
//       const firstGST = (baseAmount * gstRate) / 100;
//       subtotalAfterCess = baseAmount + firstGST + cess;
//       const discountAmount = calculateDiscount(subtotalAfterCess);
//       afterDiscount = subtotalAfterCess - discountAmount;
//       secondGST = (afterDiscount * gstRate) / 100;
//       finalTotal = afterDiscount + secondGST;
//     } else if (priceWithTax > 0) {
//       baseAmount = quantity * priceWithTax;
//       subtotalAfterCess = baseAmount + cess;
//       const discountAmount = calculateDiscount(subtotalAfterCess);
//       afterDiscount = subtotalAfterCess - discountAmount;
//       secondGST = (afterDiscount * gstRate) / 100;
//       finalTotal = afterDiscount + secondGST;
//     }

//     const roundedTotal = Math.round(finalTotal);
//     const roundOff = parseFloat((roundedTotal - finalTotal).toFixed(2));

//     const updated = await EstimateQuotation.findByIdAndUpdate(
//       id,
//       {
//         partyId,
//         billingName: encryptData(billingName)?.encryptedData,
//         refNo: encryptData(refNo)?.encryptedData,
//         invoiceDate,
//         stateOfSupply,
//         status: status || "Quotation open",
//         action: action || ["convert to sale", "convert to sale order"],
//         event,
//         item,
//         qty: encryptData(qty)?.encryptedData,
//         freeQty: encryptData(freeQty)?.encryptedData,
//         unit,
//         pricePerUnit: {
//           withTax: encryptData(pricePerUnit?.withTax || "0")?.encryptedData,
//           withoutTax: encryptData(pricePerUnit?.withoutTax || "0")?.encryptedData,
//         },
//         taxRef,
//         tax: encryptData(secondGST.toFixed(2))?.encryptedData,
//         addCess: encryptData(addCess || "0")?.encryptedData,
//         amount: encryptData(baseAmount.toFixed(2))?.encryptedData,
//         roundOff: encryptData(roundOff.toFixed(2))?.encryptedData,
//         overallDiscount: {
//           type: overallDiscount?.type,
//           value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//         },
//         totalAmount: encryptData(roundedTotal.toFixed(2))?.encryptedData,
//         description: encryptData(description || "")?.encryptedData,
//         image: encryptData(image)?.encryptedData,
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json(errorResponse(404, "Estimate Quotation not found", false));
//     }

//     await logEvent({
//       partyId,
//       insertId: updatedEstimate._id,
//       type: "Estimate Quotation",
//       event: "update",
//       data: {
//         status,
//         totalAmount: roundedTotal,
//         roundOff,
//         tax: secondGST.toFixed(2),
//         description,
//       },
//     });

//     return res.status(200).json(
//       successResponse(200, "Estimate Quotation updated successfully", null, true, {
//         id: updated._id,
//       })
//     );
//   } catch (error) {
//     console.error("Update EstimateQuotation Error:", error);
//     return res.status(500).json(errorResponse(500, error.message, false));
//   }
// };

export const updateEstimateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      billingName,
      refNo,
      invoiceDate,
      stateOfSupply,
      status = "Quotation open",
      action = ["convert to sale", "convert to sale order"],
      event,
      productItem = [],
      overallDiscount,
      description,
      image,
    } = decrypted;

    let totalAmount = 0;
    let totalGST = 0;
    let roundOff = 0;

    const processedItems = [];

    for (const item of productItem) {
      const {
        item: itemIds,
        count,
        qty,
        freeQty,
        unit,
        pricePerUnit,
        taxRef,
        addCess = "0",
      } = item;

      const quantity = parseFloat(qty || "1");
      const cess = parseFloat(addCess);
      const priceWithoutTax = parseFloat(pricePerUnit?.withoutTax || "0");
      const priceWithTax = parseFloat(pricePerUnit?.withTax || "0");

      let gstRate = 0;
      const gst = await Gst.findById(taxRef[0]);
      if (gst?.rate) {
        const rateStr = decryptData(gst.rate)?.replace("%", "");
        gstRate = parseFloat(rateStr || "0");
      }

      const calculateDiscount = (base) => {
        if (overallDiscount?.type === "amount") {
          return parseFloat(overallDiscount.value || "0");
        } else if (overallDiscount?.type === "percentage") {
          return (base * parseFloat(overallDiscount.value || "0")) / 100;
        }
        return 0;
      };

      let baseAmount = 0;
      let firstGST = 0;
      let subtotalAfterCess = 0;
      let afterDiscount = 0;
      let secondGST = 0;
      let itemFinalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        firstGST = (baseAmount * gstRate) / 100;
        subtotalAfterCess = baseAmount + firstGST + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        itemFinalTotal = afterDiscount + secondGST;
      } else if (priceWithTax > 0) {
        baseAmount = quantity * priceWithTax;
        subtotalAfterCess = baseAmount + cess;
        const discountAmount = calculateDiscount(subtotalAfterCess);
        afterDiscount = subtotalAfterCess - discountAmount;
        secondGST = (afterDiscount * gstRate) / 100;
        itemFinalTotal = afterDiscount + secondGST;
      }

      totalGST += secondGST;
      totalAmount += itemFinalTotal;

      processedItems.push({
        item: itemIds,
        count,
        qty: encryptData(qty)?.encryptedData,
        freeQty: encryptData(freeQty)?.encryptedData,
        unit,
        pricePerUnit: {
          withTax: encryptData(pricePerUnit?.withTax || "0")?.encryptedData,
          withoutTax: encryptData(pricePerUnit?.withoutTax || "0")
            ?.encryptedData,
        },
        taxRef,
        addCess: encryptData(addCess || "0")?.encryptedData,
        amount: encryptData(baseAmount.toFixed(2))?.encryptedData,
      });
    }

    const roundedTotal = Math.round(totalAmount);
    roundOff = parseFloat((roundedTotal - totalAmount).toFixed(2));

    const updated = await EstimateQuotation.findByIdAndUpdate(
      id,
      {
        partyId,
        billingName: encryptData(billingName)?.encryptedData,
        refNo: encryptData(refNo)?.encryptedData,
        invoiceDate,
        stateOfSupply,
        status,
        action,
        event,
        productItem: processedItems,
        roundOff: encryptData(roundOff.toFixed(2))?.encryptedData,
        overallDiscount: {
          type: overallDiscount?.type,
          value: encryptData(overallDiscount?.value || "0")?.encryptedData,
        },
        totalAmount: encryptData(roundedTotal.toFixed(2))?.encryptedData,
        description: encryptData(description || "")?.encryptedData,
        image: encryptData(image)?.encryptedData,
        balanceDue: encryptData(roundedTotal.toFixed(2))?.encryptedData,
      },
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json(errorResponse(404, "Estimate Quotation not found", false));
    }

    await paymentlogmodel.findOneAndUpdate(
      { estimateId: updated._id },
      {
        party: partyId,
        date: new Date(invoiceDate),
        type: "Estimate Quotation",
        total: roundedTotal.toFixed(2),
        recievedorpaid: "pending",
        Balance: roundedTotal.toFixed(2),
        paymentType: null,
        refNo: encryptData(refNo)?.encryptedData,
      },
      { new: true }
    );
    await logEvent({
      partyId,
      insertId: updated._id,
      type: "Estimate Quotation",
      event: "update",
      data: {
        status,
        totalAmount: roundedTotal,
        roundOff,
        tax: totalGST.toFixed(2),
        description,
      },
    });

    return res.status(200).json(
      successResponse(
        200,
        "Estimate Quotation updated successfully",
        null,
        true,
        {
          id: updated._id,
        }
      )
    );
  } catch (error) {
    console.error("Update EstimateQuotation Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};

// export const convertEstimateToSaleInvoice = async (req, res) => {
//   try {
//     const {body}=req.body;
//     const decrypted=JSON.parse(decryptData(body));
//     const { estimateId, paymentType, type, recieved } = decrypted;

//     const estimate = await EstimateQuotation.findById(estimateId).populate("partyId");

//     if (!estimate) {
//       return res.status(404).json({ success: false, message: "Estimate not found" });
//     }

//     let saleStatus = "unpaid";
//     const total = parseFloat(estimate.totalAmount || "0");
//     const receivedAmount = parseFloat(recieved || "0");

//     if (receivedAmount >= total) {
//       saleStatus = "paid";
//     } else if (receivedAmount > 0) {
//       saleStatus = "partially paid";
//     }

// const today = new Date();
//     const newSaleInvoice = new SaleInvoice({
//       partyId: estimate.partyId._id,
//       Billingname: estimate.billingName,
//       InvoiceDate: estimate.invoiceDate,
//       stateofsupply: estimate.stateOfSupply,
//       item: estimate.item,
//       qty: [estimate.qty],
//       unit: estimate.unit,
//       pricePerUnit: {
//         withTax: [estimate.pricePerUnit.withTax],
//         withoutTax: [estimate.pricePerUnit.withoutTax],
//       },
//       taxRef: estimate.taxRef,
//       tax: estimate.tax,
//       addCess: [estimate.addCess],
//       amount: [estimate.amount],
//       roundoff: estimate.roundOff,
//       overallDiscount: estimate.overallDiscount,
//       totalAmount: estimate.totalAmount,
//       Description: estimate.description,
//       image: estimate.image,
//       paymentType,
//       type,
//       recieved: receivedAmount.toFixed(2),
//       status: saleStatus,
//         balanceDue: "0.00"
//     });

//     const savedInvoice = await newSaleInvoice.save();

//     estimate.status = "Quotation complete";
//     estimate.action.push("convert to sale");
//     await estimate.save();

//     await logEvent({
//       partyId: estimate.partyId._id,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "convert",
//       data: {
//         estimateId: estimate._id,
//         invoiceId: savedInvoice._id,
//          date: today.toISOString().split("T")[0],
//         amount: estimate.totalAmount,
//         balance: estimate.balanceDue,
//         status: "Quotation converted to Sale Invoice",
//         paymentStatus: saleStatus
//       }
//     });

//     return res.status(200).json(successResponse(
//       200,
//      "Estimate converted to Sale Invoice successfully",
//      null,
//      true,
//        savedInvoice
//     ));

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json(errorResponse(500, "something went wrong", false));
//   }
// };

// export const convertEstimateToSaleInvoice = async (req, res) => {
//   try {
//     const encryptedBody = req.body.body || req.body;
//     const decrypted = JSON.parse(decryptData(encryptedBody));
//     const { estimateId, paymentType, type, recieved } = decrypted;

//     const estimate = await EstimateQuotation.findById(estimateId).lean();
//     if (!estimate) {
//       return res.status(404).json(errorResponse(404,"Estimate not found",false));
//     }

//     const total = parseFloat(estimate.totalAmount || "0");
//     const receivedAmount = parseFloat(recieved || "0");

//     let saleStatus = "unpaid";
//     if (receivedAmount >= total) saleStatus = "paid";
//     else if (receivedAmount > 0) saleStatus = "partially paid";

//     const items = (estimate.productItem?.map(p => p.item || []) || []).flat();
//     const qtys = (estimate.productItem?.map(p => p.qty || null) || []);
//     const units = (estimate.productItem?.map(p => p.unit || []) || []).flat();
//     const pricePerUnit = {
//       withTax: (estimate.productItem?.map(p => p.pricePerUnit?.withTax || null) || []),
//       withoutTax: (estimate.productItem?.map(p => p.pricePerUnit?.withoutTax || null) || [])
//     };
//     const taxRefs = (estimate.productItem?.map(p => p.taxRef || []) || []).flat();
//     const addCess = (estimate.productItem?.map(p => p.addCess || null) || []);
//     const amounts = (estimate.productItem?.map(p => p.amount || null) || []);

//     const newSaleInvoice = new SaleInvoice({
//       partyId: estimate.partyId,
//       billingName: estimate.billingName,
//       invoiceDate: estimate.invoiceDate,
//       stateOfSupply: estimate.stateOfSupply,
//       item: items,
//       qty: qtys,
//       unit: units,
//       pricePerUnit,
//       taxRef: taxRefs,
//       addCess,
//       amount: amounts,
//       roundOff: estimate.roundOff,
//       overallDiscount: estimate.overallDiscount,
//       totalAmount: estimate.totalAmount,
//       description: estimate.description,
//       image: estimate.image,
//       paymentType,
//       type,
//       received: receivedAmount.toFixed(2),
//       status: saleStatus,
//       balanceDue: (total - receivedAmount).toFixed(2)
//     });

//     const savedInvoice = await newSaleInvoice.save();

//     await EstimateQuotation.findByIdAndUpdate(estimateId, {
//       status: "Quotation complete",
//       $push: { action: "convert to sale" }
//     });

//     await logEvent({
//       partyId: estimate.partyId,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "convert",
//       data: {
//         estimateId: estimate._id,
//         invoiceId: savedInvoice._id,
//         date: new Date().toISOString().split("T")[0],
//         amount: estimate.totalAmount,
//         balance: (total - receivedAmount).toFixed(2),
//         status: "Quotation converted to Sale Invoice",
//         paymentStatus: saleStatus
//       }
//     });

//     return res.status(200).json(successResponse(
//       200,
//       "Estimate converted to Sale Invoice successfully",
//       null,
//       true,
//       savedInvoice
//     ));
//   } catch (err) {
//     console.error("Error converting estimate:", err);
//     return res.status(500).json(errorResponse(500, false, "Something went wrong"));
//   }
// };

// export const convertEstimateToSaleOrder = async (req, res) => {
//   try {
//     const { estimateId } = req.params;

//     const estimate = await EstimateQuotation.findById(estimateId).lean();
//     if (!estimate) {
//       return res.status(404).json({ success: false, message: "Estimate not found" });
//     }

//     const today = new Date();
//     const dueDate = new Date(today);
//     dueDate.setDate(today.getDate() + 15);

//     const saleOrderData = {
//       partyId: estimate.partyId,
//       Billingname: estimate.billingName,
//       OrderNO: estimate.refNo,
//       OrderDate: today,
//       DueDate: dueDate,
//       status: "order overdue",
//       stateofsupply: estimate.stateOfSupply,
//       item: estimate.item,
//       qty: [estimate.qty],
//       unit: estimate.unit,
//       pricePerUnit: {
//         withTax: [estimate.pricePerUnit.withTax],
//         withoutTax: [estimate.pricePerUnit.withoutTax],
//       },
//       taxRef: estimate.taxRef,
//       tax: estimate.tax,
//       addCess: [estimate.addCess],
//       amount: [estimate.amount],
//       roundoff: estimate.roundOff,
//       overallDiscount: estimate.overallDiscount,
//       totalAmount: estimate.totalAmount,
//       advancedAmount: "0",
//       paymentType: null,
//       Description: estimate.description,
//       image: estimate.image,
//       type: "Sale Order",
//       action: ["convert to sale"],
//       balance: estimate.balanceDue,
//     };

//     const newSaleOrder = await saleOrder.create(saleOrderData);

//     await EstimateQuotation.findByIdAndUpdate(estimateId, {
//       status: "Quotation complete",
//       $push: { action: "convert to sale order" },
//     });

//     await logEvent({
//       partyId: estimate.partyId,
//       insertId: newSaleOrder._id,
//       type: "Sale Order",
//       event: "create",
//       data: {
//         type: "Sale Order",
//         date: today.toISOString().split("T")[0],
//         amount: estimate.totalAmount,
//         balance: estimate.balanceDue,
//       },
//     });

//     return res.status(201).json(successResponse(201,"Estimate converted to Sale Order successfully",null,true,newSaleOrder));

//   } catch (error) {
//     console.error("Conversion Error:", error.message);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };



export const convertEstimateToSaleInvoice = async (req, res) => {
  try {
    const encryptedBody = req.body.body || req.body;
    const decrypted = JSON.parse(decryptData(encryptedBody));
    const { estimateId, paymentType, type, recieved } = decrypted;

    const estimate = await EstimateQuotation.findById(estimateId).lean();
    if (!estimate) {
      return res
        .status(404)
        .json(errorResponse(404, "Estimate not found", false));
    }

    const total = parseFloat(estimate.totalAmount || "0");
    const receivedAmount = parseFloat(recieved || "0");

    let saleStatus = "unpaid";
    if (receivedAmount >= total) saleStatus = "paid";
    else if (receivedAmount > 0) saleStatus = "partially paid";

    const items = (estimate.productItem?.map((p) => p.item || []) || []).flat();
    const qtys = estimate.productItem?.map((p) => p.qty || null) || [];
    const units = (estimate.productItem?.map((p) => p.unit || []) || []).flat();
    const pricePerUnit = {
      withTax:
        estimate.productItem?.map((p) => p.pricePerUnit?.withTax || null) || [],
      withoutTax:
        estimate.productItem?.map((p) => p.pricePerUnit?.withoutTax || null) ||
        [],
    };
    const taxRefs = (
      estimate.productItem?.map((p) => p.taxRef || []) || []
    ).flat();
    const addCess = estimate.productItem?.map((p) => p.addCess || null) || [];
    const amounts = estimate.productItem?.map((p) => p.amount || null) || [];

    const newSaleInvoice = new SaleInvoice({
      partyId: estimate.partyId,
      billingName: estimate.billingName,
      invoiceDate: estimate.invoiceDate,
      stateOfSupply: estimate.stateOfSupply,
      item: items,
      qty: qtys,
      unit: units,
      pricePerUnit,
      taxRef: taxRefs,
      addCess,
      amount: amounts,
      roundOff: estimate.roundOff,
      overallDiscount: estimate.overallDiscount,
      totalAmount: estimate.totalAmount,
      description: estimate.description,
      image: estimate.image,
      paymentType,
      type,
      received: receivedAmount.toFixed(2),
      status: saleStatus,
      balanceDue: (total - receivedAmount).toFixed(2),
    });

    const savedInvoice = await newSaleInvoice.save();

    await paymentlogmodel.deleteMany({
      estimateId: estimateId,
      type: "Estimate Quotation",
    });

    const newPaymentIn = new paymentlogmodel({
      partyId: estimate.partyId,
      invoiceId: savedInvoice._id,
      type: "sale",
      paymentType: paymentType,
      amount: receivedAmount,
      date: new Date().toISOString().split("T")[0],
    });
    await newPaymentIn.save();

    await EstimateQuotation.findByIdAndUpdate(estimateId, {
      status: "Quotation complete",
      $push: { action: "convert to sale" },
    });

    await logEvent({
      partyId: estimate.partyId,
      insertId: savedInvoice._id,
      type: "sale",
      event: "convert",
      data: {
        estimateId: estimate._id,
        invoiceId: savedInvoice._id,
        date: new Date().toISOString().split("T")[0],
        amount: estimate.totalAmount,
        balance: (total - receivedAmount).toFixed(2),
        status: "Quotation converted to Sale Invoice",
        paymentStatus: saleStatus,
      },
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Estimate converted to Sale Invoice successfully",
          null,
          true,
          savedInvoice
        )
      );
  } catch (err) {
    console.error("Error converting estimate:", err);
    return res
      .status(500)
      .json(errorResponse(500, false, "Something went wrong"));
  }
};



// export const convertEstimateToSaleOrder = async (req, res) => {
//   try {
//     const { estimateId } = req.params;

//     const estimate = await EstimateQuotation.findById(estimateId).lean();
//     if (!estimate) {
//       return res.status(404).json({ success: false, message: "Estimate not found" });
//     }

//     const today = new Date();
//     const dueDate = new Date(today);
//     dueDate.setDate(today.getDate() + 15);

//     const items = [];
//     const qtys = [];
//     const units = [];
//     const priceWithTax = [];
//     const priceWithoutTax = [];
//     const taxRefs = [];
//     const addCesses = [];
//     const amounts = [];

//     estimate.productItem.forEach((pi) => {

//       items.push(Array.isArray(pi.item) && pi.item.length > 0 ? pi.item[0] : null);
//       qtys.push(pi.qty || null);
//       units.push(Array.isArray(pi.unit) && pi.unit.length > 0 ? pi.unit[0] : null);
//       priceWithTax.push(pi.pricePerUnit?.withTax || null);
//       priceWithoutTax.push(pi.pricePerUnit?.withoutTax || null);
//       taxRefs.push(Array.isArray(pi.taxRef) && pi.taxRef.length > 0 ? pi.taxRef[0] : null);
//       addCesses.push(pi.addCess || null);
//       amounts.push(pi.amount || null);
//     });

//     const saleOrderData = {
//       partyId: estimate.partyId,
//       Billingname: estimate.billingName,
//       OrderNO: estimate.refNo,
//       OrderDate: today,
//       DueDate: dueDate,
//       status: "order overdue",
//       stateofsupply: estimate.stateOfSupply,
//       item: items,
//       qty: qtys,
//       unit: units,
//       pricePerUnit: {
//         withTax: priceWithTax,
//         withoutTax: priceWithoutTax,
//       },
//       taxRef: taxRefs,
//       addCess: addCesses,
//       amount: amounts,
//       roundoff: estimate.roundOff,
//       overallDiscount: estimate.overallDiscount,
//       totalAmount: estimate.totalAmount,
//       advancedAmount: "0",
//       paymentType: null,
//       Description: estimate.description,
//       image: estimate.image,
//       type: "Sale Order",
//       action: ["convert to sale"],
//       balance: estimate.balanceDue,
//     };

//     const newSaleOrder = await saleOrder.create(saleOrderData);

//     await EstimateQuotation.findByIdAndUpdate(estimateId, {
//       status: "Quotation complete",
//       $push: { action: "convert to sale order" },
//     });

//     await logEvent({
//       partyId: estimate.partyId,
//       insertId: newSaleOrder._id,
//       type: "Sale Order",
//       event: "create",
//       data: {
//         type: "Sale Order",
//         date: today.toISOString().split("T")[0],
//         amount: estimate.totalAmount,
//         balance: estimate.balanceDue,
//       },
//     });

//     return res.status(201).json(successResponse(201, "Estimate converted to Sale Order successfully", null, true, newSaleOrder));
//   } catch (error) {
//     console.error("Conversion Error:", error.message);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const convertEstimateToSaleOrder = async (req, res) => {
  try {
    const { estimateId } = req.params;

    const estimate = await EstimateQuotation.findById(estimateId).lean();
    if (!estimate) {
      return res
        .status(404)
        .json({ success: false, message: "Estimate not found" });
    }

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 15);

    const items = [];
    const qtys = [];
    const units = [];
    const priceWithTax = [];
    const priceWithoutTax = [];
    const taxRefs = [];
    const addCesses = [];
    const amounts = [];

    estimate.productItem.forEach((pi) => {
      items.push(
        Array.isArray(pi.item) && pi.item.length > 0 ? pi.item[0] : null
      );
      qtys.push(pi.qty || null);
      units.push(
        Array.isArray(pi.unit) && pi.unit.length > 0 ? pi.unit[0] : null
      );
      priceWithTax.push(pi.pricePerUnit?.withTax || null);
      priceWithoutTax.push(pi.pricePerUnit?.withoutTax || null);
      taxRefs.push(
        Array.isArray(pi.taxRef) && pi.taxRef.length > 0 ? pi.taxRef[0] : null
      );
      addCesses.push(pi.addCess || null);
      amounts.push(pi.amount || null);
    });

    const saleOrderData = {
      partyId: estimate.partyId,
      Billingname: estimate.billingName,
      OrderNO: estimate.refNo,
      OrderDate: today,
      DueDate: dueDate,
      status: "order overdue",
      stateofsupply: estimate.stateOfSupply,
      item: items,
      qty: qtys,
      unit: units,
      pricePerUnit: {
        withTax: priceWithTax,
        withoutTax: priceWithoutTax,
      },
      taxRef: taxRefs,
      addCess: addCesses,
      amount: amounts,
      roundoff: estimate.roundOff,
      overallDiscount: estimate.overallDiscount,
      totalAmount: estimate.totalAmount,
      advancedAmount: "0",
      paymentType: null,
      Description: estimate.description,
      image: estimate.image,
      type: "Sale Order",
      action: ["convert to sale"],
      balance: estimate.balanceDue,
    };

    const newSaleOrder = await saleOrder.create(saleOrderData);

    await EstimateQuotation.findByIdAndUpdate(estimateId, {
      status: "Quotation complete",
      $push: { action: "convert to sale order" },
    });

    await paymentlogmodel.deleteMany({
      referenceId: estimateId,
      type: "estimate",
    });

    const newPaymentIn = new paymentlogmodel({
      partyId: estimate.partyId,
      referenceId: newSaleOrder._id,
      refEstimateId: estimate._id,
      date: today,
      type: "sale",
      amount: estimate.totalAmount,
      status: "unpaid",
      paymentType: null,
    });
    await newPaymentIn.save();

    await logEvent({
      partyId: estimate.partyId,
      insertId: newSaleOrder._id,
      type: "Sale Order",
      event: "create",
      data: {
        type: "Sale Order",
        date: today.toISOString().split("T")[0],
        amount: estimate.totalAmount,
        balance: estimate.balanceDue,
      },
    });

    return res
      .status(201)
      .json(
        successResponse(
          201,
          "Estimate converted to Sale Order successfully",
          null,
          true,
          newSaleOrder
        )
      );
  } catch (error) {
    console.error("Conversion Error:", error.message);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};


export const deleteEstimateQuotation = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEstimate = await EstimateQuotation.findByIdAndDelete(id);

    if (!deletedEstimate) {
      return res
        .status(404)
        .json(errorResponse(404, "Estimate Quotation not found", false));
    }

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Estimate Quotation deleted successfully",
          null,
          true
        )
      );
  } catch (error) {
    console.error("Error deleting Estimate Quotation:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
