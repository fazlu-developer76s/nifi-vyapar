import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Gst from "../models/Gst.js";
import paymentlogmodel from "../models/paymentlogmodel.js";
import SaleInvoice from "../models/SaleInvoice.js ";
import { logEvent } from "../utils/Logsfile.js";


// export const createSaleInvoice = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));
//     const {
//       partyId,
//       Billingname,
//       PhnNo,
//       InvoiceNO,
//       InvoiceDate,
//       paymentTerms,
//       stateofsupply,
//       item,
//       qty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       recieved,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     let status = "";
//     let finalPaymentTerms = null;
//     let finalInvoiceDate = null;

//     if (type === "credit") {
//       status = "unpaid";
//       finalPaymentTerms = paymentTerms;
//       finalInvoiceDate = InvoiceDate;
//     } else if (type === "cash") {
//       status = "paid";
//     } else if (type === "sale") {
//       finalPaymentTerms = null;
//       finalInvoiceDate = null;
//     }

//     const finalQty = Array.isArray(qty) ? qty : [];
//     const finalAddCess = Array.isArray(addCess) ? addCess : [];
//     const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax) ? pricePerUnit.withoutTax : [];
//     const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax) ? pricePerUnit.withTax : [];

//     let totalFinalAmount = 0;
//     let totalRoundOff = 0;
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
//         const rateStr = decryptData(gst.rate).replace('%', '');
//         gstRate = parseFloat(rateStr || "0");
//       }

//       let baseAmount = 0;
//       let firstGST = 0;
//       let subtotalAfterCess = 0;
//       let afterDiscount = 0;
//       let secondGST = 0;
//       let finalTotal = 0;

//       if (priceWithoutTax > 0) {
//         baseAmount = quantity * priceWithoutTax;
//         firstGST = (baseAmount * gstRate) / 100;
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

//       const rounded = Math.round(finalTotal);
//       const roundOff = parseFloat((rounded - finalTotal).toFixed(2));
//       totalFinalAmount += rounded;
//       totalRoundOff += roundOff;
//       totalGST += secondGST;
//     }

 
// const encryptArray = (arr = [], fallback = "0") =>
//   arr.map(val => encryptData(val || fallback)?.encryptedData);

// const encryptedQty = encryptArray(finalQty);
// const encryptedAddCess = encryptArray(finalAddCess);
// const encryptedPriceWithoutTax = encryptArray(finalPriceWithoutTax);
// const encryptedPriceWithTax = encryptArray(finalPriceWithTax);

// // Calculate and encrypt amount per item
// const encryptedAmountPerItem = finalQty.map((_, i) => {
//   const qtyVal = parseFloat(finalQty[i] || "0");
//   const priceVal = parseFloat(finalPriceWithoutTax[i] || finalPriceWithTax[i] || "0");
//   const amount = qtyVal * priceVal;
//   return encryptData(amount.toFixed(2))?.encryptedData;
// });

//     const encryptedInvoice = new SaleInvoice({
//       partyId,
//       Billingname: encryptData(Billingname)?.encryptedData,
//       PhnNo: encryptData(PhnNo)?.encryptedData,
//       InvoiceNO: encryptData(InvoiceNO)?.encryptedData,
//       InvoiceDate,
//       paymentTerms,
//       status,
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
//       roundoff: encryptData(totalRoundOff.toFixed(2))?.encryptedData,
//       overallDiscount: {
//         type: overallDiscount?.type,
//         value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//       },
//       totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
//       recieved: encryptData(recieved || "0")?.encryptedData,
//       paymentType,
//       Description: encryptData(Description || "")?.encryptedData,
//       image,
//       transactionType: encryptData("Sale")?.encryptedData,
//       type
//     });

//      const savedInvoice = await encryptedInvoice.save();

   
//     await logEvent({
//       partyId,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "create",
//       data: {
//         status,
//         totalAmount: totalFinalAmount,
//         roundOff: totalRoundOff.toFixed(2),
//         tax: totalGST.toFixed(2),
//         recieved,
//         paymentType
//       }
//     });

//     return res
//       .status(201)
//       .json(successResponse(201, "Sale invoice created", null, true, { id: savedInvoice._id }));
//   } catch (error) {
//     console.error("Invoice Error:", error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const createSaleInvoice = async (req, res) => {
  try {
   
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      Billingname,
      PhnNo,
      InvoiceNO,
      InvoiceDate,
      paymentTerms,
      stateofsupply,
      item,
      count,
      qty,
      freeQty,
      unit,
      pricePerUnit,
      taxRef,
      addCess,
      overallDiscount,
      recieved,
      paymentType,
      Description,
      image,
      type,
    } = decrypted;


    let status = "";
    let finalPaymentTerms = null;
    let finalInvoiceDate = null;

    if (type === "credit") {
      status = "unpaid";
      finalPaymentTerms = paymentTerms;
      finalInvoiceDate = InvoiceDate;
    } else if (type === "cash") {
      status = "paid";
    } else if (type === "sale") {
      finalPaymentTerms = null;
      finalInvoiceDate = null;
    }

    const finalCount = Array.isArray(count) ? count : [];
    const finalQty = Array.isArray(qty) ? qty : [];
    const finalFreeQty = Array.isArray(freeQty) ? freeQty : [];
    const finalAddCess = Array.isArray(addCess) ? addCess : [];
    const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax) ? pricePerUnit.withoutTax : [];
    const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax) ? pricePerUnit.withTax : [];
    const finalItem = Array.isArray(item) ? item : [];
    const finalUnit = Array.isArray(unit) ? unit : [];
    const finalTaxRef = Array.isArray(taxRef) ? taxRef : [];

    const calculateDiscount = (base) => {
      if (overallDiscount?.type === "amount") {
        return parseFloat(overallDiscount.value || "0");
      } else if (overallDiscount?.type === "percentage") {
        return (base * parseFloat(overallDiscount.value || "0")) / 100;
      }
      return 0;
    };

    let totalFinalAmount = 0;
    let totalRoundOff = 0;
    let totalGST = 0;

    const productItem = [];

    for (let i = 0; i < finalItem.length; i++) {
      const quantity = parseFloat(finalQty[i] || "1");
      const freeQuantity = parseFloat(finalFreeQty[i] || "0");
      const itemCount = finalCount[i] || "0";
      const cess = parseFloat(finalAddCess[i] || "0");
      const priceWithoutTax = parseFloat(finalPriceWithoutTax[i] || "0");
      const priceWithTax = parseFloat(finalPriceWithTax[i] || "0");

  
      let gstRate = 0;
      if (finalTaxRef[i]) {
        const gst = await Gst.findById(finalTaxRef[i]);
        if (gst && gst.rate) {
          const rateStr = decryptData(gst.rate).replace('%', '');
          gstRate = parseFloat(rateStr || "0");
        }
      }


      let baseAmount = 0;
      let firstGST = 0;
      let subtotalAfterCess = 0;
      let afterDiscount = 0;
      let secondGST = 0;
      let finalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        firstGST = (baseAmount * gstRate) / 100;
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

      const rounded = Math.round(finalTotal);
      const roundOff = parseFloat((rounded - finalTotal).toFixed(2));

      totalFinalAmount += rounded;
      totalRoundOff += roundOff;
      totalGST += secondGST;

  
      productItem.push({
        item: [finalItem[i]], 
        count: encryptData(itemCount)?.encryptedData,
        qty: encryptData(quantity.toString())?.encryptedData,
        freeQty: encryptData(freeQuantity.toString())?.encryptedData,
        unit: [finalUnit[i]], 
        pricePerUnit: {
          withTax: encryptData(priceWithTax.toString())?.encryptedData,
          withoutTax: encryptData(priceWithoutTax.toString())?.encryptedData,
        },
        taxRef: [finalTaxRef[i]],
        addCess: encryptData(cess.toString())?.encryptedData,
        amount: encryptData(rounded.toString())?.encryptedData,
      });
    }

    // Create new SaleInvoice document
    const encryptedInvoice = new SaleInvoice({
      partyId,
      Billingname: encryptData(Billingname)?.encryptedData,
      PhnNo: encryptData(PhnNo)?.encryptedData,
      InvoiceNO: encryptData(InvoiceNO)?.encryptedData,
      InvoiceDate: finalInvoiceDate || InvoiceDate,
      paymentTerms: finalPaymentTerms || paymentTerms,
      status,
      stateofsupply,
      productItem,
      roundoff: encryptData(totalRoundOff.toFixed(2))?.encryptedData,
      overallDiscount: {
        type: overallDiscount?.type,
        value: encryptData(overallDiscount?.value || "0")?.encryptedData,
      },
      totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
      recieved: encryptData(recieved || "0")?.encryptedData,
      paymentType,
      Description: encryptData(Description || "")?.encryptedData,
      image,
      transactionType: encryptData("Sale")?.encryptedData,
      type,
      tax: encryptData(totalGST.toFixed(2))?.encryptedData,
    });

    const savedInvoice = await encryptedInvoice.save();
   // Save to payment log (type: "sale")
    const paymentLog = new paymentlogmodel({
      party: partyId,
      date: new Date(),
      type: "sale",
      total: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
      recievedorpaid: encryptData(recieved || "0")?.encryptedData,
      Balance: encryptData((totalFinalAmount - parseFloat(recieved || "0")).toFixed(2))?.encryptedData,
      paymentType,
    });

    await paymentLog.save();
    await logEvent({
      partyId,
      insertId: savedInvoice._id,
      type: "sale",
      event: "create",
      data: {
        status,
        totalAmount: totalFinalAmount,
        roundOff: totalRoundOff.toFixed(2),
        tax: totalGST.toFixed(2),
        recieved,
        paymentType,
      },
    });

    return res
      .status(201)
      .json(successResponse(201, "Sale invoice created", null, true, { id: savedInvoice._id }));
  } catch (error) {
    console.error("error in creating invoice",error);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


// export const updateSaleInvoice = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       Billingname,
//       PhnNo,
//       InvoiceNO,
//       InvoiceDate,
//       paymentTerms,
//       stateofsupply,
//       item,
//       qty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       recieved,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     let status = "";
//     let finalPaymentTerms = null;
//     let finalInvoiceDate = null;

//     if (type === "credit") {
//       status = "unpaid";
//       finalPaymentTerms = paymentTerms;
//       finalInvoiceDate = InvoiceDate;
//     } else if (type === "cash") {
//       status = "paid";
//     } else if (type === "sale") {
//       finalPaymentTerms = null;
//       finalInvoiceDate = null;
//     }

//     const finalQty = Array.isArray(qty) ? qty : [];
//     const finalAddCess = Array.isArray(addCess) ? addCess : [];
//     const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax) ? pricePerUnit.withoutTax : [];
//     const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax) ? pricePerUnit.withTax : [];

//     let totalFinalAmount = 0;
//     let totalRoundOff = 0;
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
//         const rateStr = decryptData(gst.rate).replace('%', '');
//         gstRate = parseFloat(rateStr || "0");
//       }

//       let baseAmount = 0;
//       let firstGST = 0;
//       let subtotalAfterCess = 0;
//       let afterDiscount = 0;
//       let secondGST = 0;
//       let finalTotal = 0;

//       if (priceWithoutTax > 0) {
//         baseAmount = quantity * priceWithoutTax;
//         firstGST = (baseAmount * gstRate) / 100;
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

//       const rounded = Math.round(finalTotal);
//       const roundOff = parseFloat((rounded - finalTotal).toFixed(2));
//       totalFinalAmount += rounded;
//       totalRoundOff += roundOff;
//       totalGST += secondGST;
//     }

//     const encryptArray = (arr = [], fallback = "0") =>
//       arr.map(val => encryptData(val || fallback)?.encryptedData);

//     const encryptedQty = encryptArray(finalQty);
//     const encryptedAddCess = encryptArray(finalAddCess);
//     const encryptedPriceWithoutTax = encryptArray(finalPriceWithoutTax);
//     const encryptedPriceWithTax = encryptArray(finalPriceWithTax);

//     const encryptedAmountPerItem = finalQty.map((_, i) => {
//       const qtyVal = parseFloat(finalQty[i] || "0");
//       const priceVal = parseFloat(finalPriceWithoutTax[i] || finalPriceWithTax[i] || "0");
//       const amount = qtyVal * priceVal;
//       return encryptData(amount.toFixed(2))?.encryptedData;
//     });

//     const updatedInvoice = await SaleInvoice.findByIdAndUpdate(
//       id,
//       {
//         partyId,
//         Billingname: encryptData(Billingname)?.encryptedData,
//         PhnNo: encryptData(PhnNo)?.encryptedData,
//         InvoiceNO: encryptData(InvoiceNO)?.encryptedData,
//         InvoiceDate,
//         paymentTerms,
//         status,
//         stateofsupply,
//         item,
//         qty: encryptedQty,
//         unit,
//         pricePerUnit: {
//           withTax: encryptedPriceWithTax,
//           withoutTax: encryptedPriceWithoutTax,
//         },
//         taxRef,
//         tax: encryptData(totalGST.toFixed(2))?.encryptedData,
//         addCess: encryptedAddCess,
//         amount: encryptedAmountPerItem,
//         roundoff: encryptData(totalRoundOff.toFixed(2))?.encryptedData,
//         overallDiscount: {
//           type: overallDiscount?.type,
//           value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//         },
//         totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
//         recieved: encryptData(recieved || "0")?.encryptedData,
//         paymentType,
//         Description: encryptData(Description || "")?.encryptedData,
//         image,
//         transactionType: encryptData("Sale")?.encryptedData,
//         type,
//       },
//       { new: true }
//     );

//     if (!updatedInvoice) {
//       return res.status(404).json(errorResponse(404, "Sale invoice not found", false));
//     }
//   await logEvent({
//       partyId,
//       insertId: savedInvoice._id,
//       type: "sale",
//       event: "update",
//       data: {
//         status,
//         totalAmount: totalFinalAmount,
//         roundOff: totalRoundOff.toFixed(2),
//         tax: totalGST.toFixed(2),
//         recieved,
//         paymentType
//       }
//     });
//     return res
//       .status(200)
//       .json(successResponse(200, "Sale invoice updated", null, true, updatedInvoice));
//   } catch (error) {
//     console.error("Update Invoice Error:", error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };




// export const getSaleInvoices = async (req, res) => {
//   try {
//     // const user = req.user;

//     const invoices = await SaleInvoice.find()
//       .populate("partyId")
//       .populate("taxRef")
//       .populate("unit")
//       .populate("item")
//       .populate("paymentType")
//       .sort({ createdAt: -1 });

//     const decryptedInvoices = invoices.map((invoice) => ({
//       _id: invoice._id,
//       party: invoice.partyId
//         ? {
//             _id: invoice.partyId._id,
//             name: invoice.partyId.name
//               ? decryptData(invoice.partyId.name)
//               : null,
//             email: invoice.partyId.email
//               ? decryptData(invoice.partyId.email)
//               : null,
//             phone: invoice.partyId.phone
//               ? decryptData(invoice.partyId.phone)
//               : null,
//             // address: invoice.partyId.address
//             //   ? decryptData(invoice.partyId.address)
//             //   : null,
//             gstIn: invoice.partyId.gstIn
//               ? decryptData(invoice.partyId.gstIn)
//               : null,
//           }
//         : null,
//       Billingname: invoice.Billingname
//         ? decryptData(invoice.Billingname)
//         : null,
//       PhnNo: invoice.PhnNo ? decryptData(invoice.PhnNo) : null,
//       InvoiceNO: invoice.InvoiceNO ? decryptData(invoice.InvoiceNO) : null,
//       InvoiceDate: invoice.InvoiceDate,
//       paymentTerms: invoice.paymentTerms,
//       stateofsupply: invoice.stateofsupply,
//       status: invoice.status,
//       item: invoice.item.map((itm) => ({
//         _id: itm._id,
//         itemName: itm.itemName ? decryptData(itm.itemName) : null,
//         itemHSN: itm.itemHSN ? decryptData(itm.itemHSN) : null,
//         itemCode: itm.itemCode,
//       })),
//       qty: invoice.qty?.map(decryptData),
//       unit: invoice.unit?.map((u) => ({
//         _id: u._id,
//         name: u.name ? decryptData(u.name) : null,
//         status: u.status,
//       })),
//       pricePerUnit: {
//         withTax: invoice.pricePerUnit.withTax?.map(decryptData),
//         withoutTax: invoice.pricePerUnit.withoutTax?.map(decryptData),
//       },
//       taxRef: invoice.taxRef?.map((gst) => ({
//         _id: gst._id,
//         label: gst.label ? decryptData(gst.label) : null,
//         rate: gst.rate ? decryptData(gst.rate) : null,
//       })),
//       tax: invoice.tax ? decryptData(invoice.tax) : null,
//       addCess: invoice.addCess?.map(decryptData),
//       amount: invoice.amount?.map(decryptData),
//       roundoff: invoice.roundoff ? decryptData(invoice.roundoff) : null,
//       overallDiscount: {
//         type: invoice.overallDiscount?.type,
//         value: invoice.overallDiscount?.value
//           ? decryptData(invoice.overallDiscount.value)
//           : null,
//       },
//       totalAmount: invoice.totalAmount
//         ? decryptData(invoice.totalAmount)
//         : null,
//       recieved: invoice.recieved ? decryptData(invoice.recieved) : null,
//       paymentType: invoice.paymentType
//         ? {
//             _id: invoice.paymentType._id,
//             name: invoice.paymentType.name
//               ? decryptData(invoice.paymentType.name)
//               : null,
//           }
//         : null,
//       Description: invoice.Description
//         ? decryptData(invoice.Description)
//         : null,
//       image: invoice.image,
//       transactionType: invoice.transactionType
//         ? decryptData(invoice.transactionType)
//         : null,
//       type: invoice.type,
//       createdAt: invoice.createdAt,
//       updatedAt: invoice.updatedAt,
//     }));

//     return res
//       .status(200)
//       .json(
//         successResponse(
//           200,
//           "Sale invoices fetched successfully",
//           "",
//           true,
//           decryptedInvoices
//         )
//       );
//   } catch (error) {
//     console.error("Get All Sale Invoices Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };


// export const updateSaleInvoice = async (req, res) => {
//   try {
//     const { id } = req.params; // assuming you pass invoice ID in URL params
//     const { body } = req.body;
//     const decrypted = JSON.parse(decryptData(body));

//     const {
//       partyId,
//       Billingname,
//       PhnNo,
//       InvoiceNO,
//       InvoiceDate,
//       paymentTerms,
//       stateofsupply,
//       item,
//       count,
//       qty,
//       freeQty,
//       unit,
//       pricePerUnit,
//       taxRef,
//       addCess,
//       overallDiscount,
//       recieved,
//       paymentType,
//       Description,
//       image,
//       type,
//     } = decrypted;

//     // Determine status and invoice date based on type
//     let status = "";
//     let finalPaymentTerms = null;
//     let finalInvoiceDate = null;

//     if (type === "credit") {
//       status = "unpaid";
//       finalPaymentTerms = paymentTerms;
//       finalInvoiceDate = InvoiceDate;
//     } else if (type === "cash") {
//       status = "paid";
//     } else if (type === "sale") {
//       finalPaymentTerms = null;
//       finalInvoiceDate = null;
//     }

//     // Ensure arrays
//     const finalCount = Array.isArray(count) ? count : [];
//     const finalQty = Array.isArray(qty) ? qty : [];
//     const finalFreeQty = Array.isArray(freeQty) ? freeQty : [];
//     const finalAddCess = Array.isArray(addCess) ? addCess : [];
//     const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax) ? pricePerUnit.withoutTax : [];
//     const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax) ? pricePerUnit.withTax : [];
//     const finalItem = Array.isArray(item) ? item : [];
//     const finalUnit = Array.isArray(unit) ? unit : [];
//     const finalTaxRef = Array.isArray(taxRef) ? taxRef : [];

//     const calculateDiscount = (base) => {
//       if (overallDiscount?.type === "amount") {
//         return parseFloat(overallDiscount.value || "0");
//       } else if (overallDiscount?.type === "percentage") {
//         return (base * parseFloat(overallDiscount.value || "0")) / 100;
//       }
//       return 0;
//     };

//     // Totals
//     let totalFinalAmount = 0;
//     let totalRoundOff = 0;
//     let totalGST = 0;

//     // Prepare productItem array according to schema
//     const productItem = [];

//     for (let i = 0; i < finalItem.length; i++) {
//       const quantity = parseFloat(finalQty[i] || "1");
//       const freeQuantity = parseFloat(finalFreeQty[i] || "0");
//       const itemCount = finalCount[i] || "0";
//       const cess = parseFloat(finalAddCess[i] || "0");
//       const priceWithoutTax = parseFloat(finalPriceWithoutTax[i] || "0");
//       const priceWithTax = parseFloat(finalPriceWithTax[i] || "0");

//       // Get GST rate decrypted
//       let gstRate = 0;
//       if (finalTaxRef[i]) {
//         const gst = await Gst.findById(finalTaxRef[i]);
//         if (gst && gst.rate) {
//           const rateStr = decryptData(gst.rate).replace('%', '');
//           gstRate = parseFloat(rateStr || "0");
//         }
//       }

//       // Calculate amounts
//       let baseAmount = 0;
//       let firstGST = 0;
//       let subtotalAfterCess = 0;
//       let afterDiscount = 0;
//       let secondGST = 0;
//       let finalTotal = 0;

//       if (priceWithoutTax > 0) {
//         baseAmount = quantity * priceWithoutTax;
//         firstGST = (baseAmount * gstRate) / 100;
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

//       const rounded = Math.round(finalTotal);
//       const roundOff = parseFloat((rounded - finalTotal).toFixed(2));

//       totalFinalAmount += rounded;
//       totalRoundOff += roundOff;
//       totalGST += secondGST;

     
//       productItem.push({
//         item: [finalItem[i]],
//         count: encryptData(itemCount)?.encryptedData,
//         qty: encryptData(quantity.toString())?.encryptedData,
//         freeQty: encryptData(freeQuantity.toString())?.encryptedData,
//         unit: [finalUnit[i]],
//         pricePerUnit: {
//           withTax: encryptData(priceWithTax.toString())?.encryptedData,
//           withoutTax: encryptData(priceWithoutTax.toString())?.encryptedData,
//         },
//         taxRef: [finalTaxRef[i]],
//         addCess: encryptData(cess.toString())?.encryptedData,
//         amount: encryptData(rounded.toString())?.encryptedData,
//       });
//     }

//     const updatedInvoice = await SaleInvoice.findByIdAndUpdate(
//       id,
//       {
//         partyId,
//         Billingname: encryptData(Billingname)?.encryptedData,
//         PhnNo: encryptData(PhnNo)?.encryptedData,
//         InvoiceNO: encryptData(InvoiceNO)?.encryptedData,
//         InvoiceDate: finalInvoiceDate || InvoiceDate,
//         paymentTerms: finalPaymentTerms || paymentTerms,
//         status,
//         stateofsupply,
//         productItem,
//         roundoff: encryptData(totalRoundOff.toFixed(2))?.encryptedData,
//         overallDiscount: {
//           type: overallDiscount?.type,
//           value: encryptData(overallDiscount?.value || "0")?.encryptedData,
//         },
//         totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
//         recieved: encryptData(recieved || "0")?.encryptedData,
//         paymentType,
//         Description: encryptData(Description || "")?.encryptedData,
//         image,
//         transactionType: encryptData("Sale")?.encryptedData,
//         type,
//         tax: encryptData(totalGST.toFixed(2))?.encryptedData,
//       },
//       { new: true }
//     );

//     if (!updatedInvoice) {
//       return res.status(404).json(errorResponse(404, "Sale invoice not found", false));
//     }

//     await logEvent({
//       partyId,
//       insertId: updatedInvoice._id,
//       type: "sale",
//       event: "update",
//       data: {
//         status,
//         totalAmount: totalFinalAmount,
//         roundOff: totalRoundOff.toFixed(2),
//         tax: totalGST.toFixed(2),
//         recieved,
//         paymentType,
//       },
//     });

//     return res
//       .status(200)
//       .json(successResponse(200, "Sale invoice updated", null, true, { id: updatedInvoice._id }));
//   } catch (error) {
//     console.error("Invoice Update Error:", error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const updateSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params; 
    const { body } = req.body;
    const decrypted = JSON.parse(decryptData(body));

    const {
      partyId,
      Billingname,
      PhnNo,
      InvoiceNO,
      InvoiceDate,
      paymentTerms,
      stateofsupply,
      item,
      count,
      qty,
      freeQty,
      unit,
      pricePerUnit,
      taxRef,
      addCess,
      overallDiscount,
      recieved,
      paymentType,
      Description,
      image,
      type,
    } = decrypted;

    const finalCount = Array.isArray(count) ? count : [];
    const finalQty = Array.isArray(qty) ? qty : [];
    const finalFreeQty = Array.isArray(freeQty) ? freeQty : [];
    const finalAddCess = Array.isArray(addCess) ? addCess : [];
    const finalPriceWithoutTax = Array.isArray(pricePerUnit?.withoutTax) ? pricePerUnit.withoutTax : [];
    const finalPriceWithTax = Array.isArray(pricePerUnit?.withTax) ? pricePerUnit.withTax : [];
    const finalItem = Array.isArray(item) ? item : [];
    const finalUnit = Array.isArray(unit) ? unit : [];
    const finalTaxRef = Array.isArray(taxRef) ? taxRef : [];


    const calculateDiscount = (base) => {
      if (overallDiscount?.type === "amount") {
        return parseFloat(overallDiscount.value || "0");
      } else if (overallDiscount?.type === "percentage") {
        return (base * parseFloat(overallDiscount.value || "0")) / 100;
      }
      return 0;
    };


    let totalFinalAmount = 0;
    let totalRoundOff = 0;
    let totalGST = 0;
    const productItem = [];

    for (let i = 0; i < finalItem.length; i++) {
      const quantity = parseFloat(finalQty[i] || "1");
      const freeQuantity = parseFloat(finalFreeQty[i] || "0");
      const itemCount = finalCount[i] || "0";
      const cess = parseFloat(finalAddCess[i] || "0");
      const priceWithoutTax = parseFloat(finalPriceWithoutTax[i] || "0");
      const priceWithTax = parseFloat(finalPriceWithTax[i] || "0");

     
      let gstRate = 0;
      if (finalTaxRef[i]) {
        const gst = await Gst.findById(finalTaxRef[i]);
        if (gst && gst.rate) {
          const rateStr = decryptData(gst.rate).replace('%', '');
          gstRate = parseFloat(rateStr || "0");
        }
      }

     
      let baseAmount = 0;
      let firstGST = 0;
      let subtotalAfterCess = 0;
      let afterDiscount = 0;
      let secondGST = 0;
      let finalTotal = 0;

      if (priceWithoutTax > 0) {
        baseAmount = quantity * priceWithoutTax;
        firstGST = (baseAmount * gstRate) / 100;
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

      const rounded = Math.round(finalTotal);
      const roundOff = parseFloat((rounded - finalTotal).toFixed(2));

      totalFinalAmount += rounded;
      totalRoundOff += roundOff;
      totalGST += secondGST;

      productItem.push({
        item: [finalItem[i]],
        count: encryptData(itemCount)?.encryptedData,
        qty: encryptData(quantity.toString())?.encryptedData,
        freeQty: encryptData(freeQuantity.toString())?.encryptedData,
        unit: [finalUnit[i]],
        pricePerUnit: {
          withTax: encryptData(priceWithTax.toString())?.encryptedData,
          withoutTax: encryptData(priceWithoutTax.toString())?.encryptedData,
        },
        taxRef: [finalTaxRef[i]],
        addCess: encryptData(cess.toString())?.encryptedData,
        amount: encryptData(rounded.toString())?.encryptedData,
      });
    }

    const receivedAmountNum = parseFloat(recieved || "0");

    let status = "";
    if (receivedAmountNum === 0) {
      status = "unpaid";
    } else if (receivedAmountNum >= totalFinalAmount) {
      status = "paid";
    } else if (receivedAmountNum > 0 && receivedAmountNum < totalFinalAmount) {
      status = "partially paid";
    }

    if (type === "credit") {
      status = "unpaid";
    } else if (type === "cash") {
      status = "paid";
    }

    const updatedInvoice = await SaleInvoice.findByIdAndUpdate(
      id,
      {
        partyId,
        Billingname: encryptData(Billingname)?.encryptedData,
        PhnNo: encryptData(PhnNo)?.encryptedData,
        InvoiceNO: encryptData(InvoiceNO)?.encryptedData,
        InvoiceDate: InvoiceDate,
        paymentTerms: paymentTerms,
        status,
        stateofsupply,
        productItem,
        roundoff: encryptData(totalRoundOff.toFixed(2))?.encryptedData,
        overallDiscount: {
          type: overallDiscount?.type,
          value: encryptData(overallDiscount?.value || "0")?.encryptedData,
        },
        totalAmount: encryptData(totalFinalAmount.toFixed(2))?.encryptedData,
        recieved: encryptData(recieved || "0")?.encryptedData,
        paymentType,
        Description: encryptData(Description || "")?.encryptedData,
        image,
        transactionType: encryptData("Sale")?.encryptedData,
        type,
        tax: encryptData(totalGST.toFixed(2))?.encryptedData,
      },
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json(errorResponse(404, "Sale invoice not found", false));
    }

    // Save PaymentLog if type is cash OR received amount > 0
    if (type === "cash" || receivedAmountNum > 0) {
      await paymentlogmodel.create({
        partyId,
        invoiceId: updatedInvoice._id,
        amount: encryptData(recieved || "0")?.encryptedData,
        paymentType,
        transactionType: encryptData("Sale")?.encryptedData,
        date: InvoiceDate,
        note: encryptData("Payment received during invoice update")?.encryptedData,
      });
    }

    await logEvent({
      partyId,
      insertId: updatedInvoice._id,
      type: "sale",
      event: "update",
      data: {
        status,
        totalAmount: totalFinalAmount,
        roundOff: totalRoundOff.toFixed(2),
        tax: totalGST.toFixed(2),
        recieved,
        paymentType,
      },
    });

    return res
      .status(200)
      .json(successResponse(200, "Sale invoice updated", null, true, { id: updatedInvoice._id }));
  } catch (error) {
    console.error("Invoice Update Error:", error);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const getSaleInvoices = async (req, res) => {
  try {
    const invoices = await SaleInvoice.find()
      .populate("partyId")
      .populate("paymentType")
      .populate({
        path: "productItem",
        populate: [
          { path: "item" },  // can be array or single object
          { path: "unit" },  // can be array or single object
          { path: "taxRef" }, // can be array or single object
        ],
      })
      .sort({ createdAt: -1 });

    const decryptedInvoices = invoices.map((invoice) => ({
      _id: invoice._id,
      party: invoice.partyId
        ? {
            _id: invoice.partyId._id,
            name: invoice.partyId.name ? decryptData(invoice.partyId.name) : null,
            email: invoice.partyId.email ? decryptData(invoice.partyId.email) : null,
            phone: invoice.partyId.phone ? decryptData(invoice.partyId.phone) : null,
            gstIn: invoice.partyId.gstIn ? decryptData(invoice.partyId.gstIn) : null,
          }
        : null,
      Billingname: invoice.Billingname ? decryptData(invoice.Billingname) : null,
      PhnNo: invoice.PhnNo ? decryptData(invoice.PhnNo) : null,
      InvoiceNO: invoice.InvoiceNO ? decryptData(invoice.InvoiceNO) : null,
      InvoiceDate: invoice.InvoiceDate,
      paymentTerms: invoice.paymentTerms,
      stateofsupply: invoice.stateofsupply,
      status: invoice.status,

      productItem: invoice.productItem.map((prod) => ({
        item: Array.isArray(prod.item)
          ? prod.item.map((itm) => ({
              _id: itm._id,
              itemName: itm.itemName ? decryptData(itm.itemName) : null,
              itemHSN: itm.itemHSN ? decryptData(itm.itemHSN) : null,
              itemCode: itm.itemCode,
            }))
          : prod.item
          ? {
              _id: prod.item._id,
              itemName: prod.item.itemName ? decryptData(prod.item.itemName) : null,
              itemHSN: prod.item.itemHSN ? decryptData(prod.item.itemHSN) : null,
              itemCode: prod.item.itemCode,
            }
          : [],

        count: prod.count ? decryptData(prod.count) : null,
        qty: prod.qty ? decryptData(prod.qty) : null,
        freeQty: prod.freeQty ? decryptData(prod.freeQty) : null,

        unit: Array.isArray(prod.unit)
          ? prod.unit.map((u) => ({
              _id: u._id,
              name: u.name ? decryptData(u.name) : null,
              status: u.status,
            }))
          : prod.unit
          ? {
              _id: prod.unit._id,
              name: prod.unit.name ? decryptData(prod.unit.name) : null,
              status: prod.unit.status,
            }
          : [],

        pricePerUnit: {
          withTax: prod.pricePerUnit?.withTax
            ? decryptData(prod.pricePerUnit.withTax)
            : null,
          withoutTax: prod.pricePerUnit?.withoutTax
            ? decryptData(prod.pricePerUnit.withoutTax)
            : null,
        },

        taxRef: Array.isArray(prod.taxRef)
          ? prod.taxRef.map((gst) => ({
              _id: gst._id,
              label: gst.label ? decryptData(gst.label) : null,
              rate: gst.rate ? decryptData(gst.rate) : null,
            }))
          : prod.taxRef
          ? {
              _id: prod.taxRef._id,
              label: prod.taxRef.label
                ? decryptData(prod.taxRef.label)
                : null,
              rate: prod.taxRef.rate ? decryptData(prod.taxRef.rate) : null,
            }
          : [],

        addCess: prod.addCess ? decryptData(prod.addCess) : null,
        amount: prod.amount ? decryptData(prod.amount) : null,
      })),

      roundoff: invoice.roundoff ? decryptData(invoice.roundoff) : null,
      overallDiscount: {
        type: invoice.overallDiscount?.type,
        value: invoice.overallDiscount?.value
          ? decryptData(invoice.overallDiscount.value)
          : null,
      },
      totalAmount: invoice.totalAmount ? decryptData(invoice.totalAmount) : null,
      recieved: invoice.recieved ? decryptData(invoice.recieved) : null,
      paymentType: invoice.paymentType
        ? {
            _id: invoice.paymentType._id,
            name: invoice.paymentType.name
              ? decryptData(invoice.paymentType.name)
              : null,
          }
        : null,
      Description: invoice.Description ? decryptData(invoice.Description) : null,
      image: invoice.image,
      transactionType: invoice.transactionType
        ? decryptData(invoice.transactionType)
        : null,
      type: invoice.type,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    }));

    return res.status(200).json(
      successResponse(
        200,
        "Sale invoices fetched successfully",
        "",
        true,
        decryptedInvoices
      )
    );
  } catch (error) {
    console.error("Get All Sale Invoices Error:", error);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};





export const deleteSaleInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await SaleInvoice.findByIdAndDelete(id);
    if (!deletedInvoice) {
      return res
        .status(404)
        .json(errorResponse(404, "Invoice not found", false));
    }
    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Sale invoice deleted successfully",
          null,
          true,
          deletedInvoice
        )
      );
  } catch (error) {
    console.error("Error deleting sale invoice:", error.message);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong.", false));
  }
};


export const getSaleInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const saleInvoice = await SaleInvoice.findById(id)
      .populate("partyId")
      .populate({
        path: "item.productId",
        model: "Productitem"
      });

    if (!saleInvoice) {
      return res.status(404).json({ success: false, message: "Sale Invoice not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Sale Invoice fetched successfully",
      data: saleInvoice,
    });
  } catch (error) {
    console.error("Error fetching sale invoice:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};