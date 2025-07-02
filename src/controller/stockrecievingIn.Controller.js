import PurchaseOrder from "../models/PurchaseOrder.js";
import Stocktransfer from "../models/Stocktransfer.js";
import StockInRecieving from "../models/StockInRecieving.js";

export const receiveAndInspectGoods = async (req, res) => {
  try {
    const { purchaseOrderId, godownId, itemInspections, actionTaken } =
      req.body;

    const purchaseOrder = await PurchaseOrder.findById(
      purchaseOrderId
    ).populate("items.productItem");
    if (!purchaseOrder) {
      return res
        .status(404)
        .json({ status: false, message: "Purchase Order not found" });
    }

    const expectedItemsMap = {};
    purchaseOrder.items.forEach((item) => {
      expectedItemsMap[item.productItem._id.toString()] = item.quantity;
    });

    const returnReports = [];

    for (const inspection of itemInspections) {
      const expectedQty = expectedItemsMap[inspection.productItem];
      const receivedQty = Number(inspection.receivedQty);

      if (inspection.qualityStatus !== "good" || receivedQty !== expectedQty) {
        returnReports.push({
          purchaseOrderId,
          productItem: inspection.productItem,
          receivedQty,
          expectedQty,
          qualityStatus: inspection.qualityStatus,
          remarks: inspection.remarks,
          godownId,
          createdBy: req.user?._id,
        });
      }
    }

    // Save return/damage logs if any
    // if (returnReports.length > 0) {
    //   await ReturnDamageReport.insertMany(returnReports);
    // }

    const allItemsAccepted = itemInspections.every(
      (item) =>
        item.recievingStatus === "Recieved" &&
        item.qualityStatus === "good" &&
        Number(item.receivedQty) === expectedItemsMap[item.productItem]
    );

    let stockEntry = null;

    if (allItemsAccepted) {
      stockEntry = await Stocktransfer.create({
        From: purchaseOrder.supplierGodownId || null,
        To: godownId,
        ItemName: itemInspections.map((i) => i.productItem),
        userId: req.user?._id,
      });
    }

    const receivingRecord = await StockInRecieving.create({
      purchaseOrderId,
      godownId,
      stock: stockEntry?._id || null,
      itemInspections,
      actionTaken: allItemsAccepted ? "Stored" : actionTaken,
      inspectedAt: new Date(),
    });

    return res.status(201).json({
      status: true,
      message: "Receiving and inspection completed",
      receiving: receivingRecord,
      returnsLogged: returnReports.length,
    });
  } catch (error) {
    console.error("Receiving error:", error);
    res.status(500).json({
      status: false,
      message: "Server Error during receiving",
    });
  }
};
