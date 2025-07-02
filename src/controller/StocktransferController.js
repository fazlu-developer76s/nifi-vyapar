import { decryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import Stocktransfer from "../models/Stocktransfer.js ";

export const createStock = async (req, res) => {
  try {
    const user=req.user
    //   const { body } = req.body;
    //   const decrypted = JSON.parse(decryptData(body));
  
      const {
        transferdate,
        From,
        To,
        ItemName,
        QuantityTotransfer,
        ImeiNo,
        qualitystatus,

      } = req.decryptedBody;
  
      const newStock = await Stocktransfer.create({
        transferdate,
        From,
        To,
        ItemName,
        QuantityTotransfer,
        
        userId:user
      });
  
      return res.status(201).json(successResponse(201, "Stock created successfully", null, true, newStock));
    } catch (error) {
      console.error("Create Stock Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false));
    }
  };
  

  // export const getAllStocks = async (req, res) => {
  //   try {
  //     const stocks = await Stocktransfer.find()
  //       .populate("From", "GodownName GodownType")
  //       .populate("To", "GodownName GodownType")
  //       .populate("ItemName", "itemName")
  //       .sort({ createdAt: -1 });
  
      
  //     const decryptedStocks = stocks.map((stock) => ({
  //       _id: stock._id,
  //       transferdate: stock.transferdate,
  //       QuantityTotransfer: stock.QuantityTotransfer,
  //       createdAt: stock.createdAt,
  //       updatedAt: stock.updatedAt,
  //       From: {
  //         ...stock.From._doc,
  //         GodownName: decryptData(stock.From?.GodownName),
  //       },
  //       To: {
  //         ...stock.To._doc,
  //         GodownName: decryptData(stock.To?.GodownName),
  //       },
  //       ItemName: stock.ItemName.map((item) => ({
  //         ...item._doc,
  //         itemName: decryptData(item.itemName),
  //       })),
  //     }));
  
  //     return res
  //       .status(200)
  //       .json(successResponse(200, "All stocks fetched", null, true, decryptedStocks));
  //   } catch (error) {
  //     console.error("Get All Stocks Error:", error);
  //     return res
  //       .status(500)
  //       .json(errorResponse(500, error.message || "Internal server error", false));
  //   }
  // };
  
  export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stocktransfer.find()
      .populate("From", "GodownName GodownType")
      .populate("To", "GodownName GodownType")
      .populate("ItemName", "itemName")
      .sort({ createdAt: -1 });

    const decryptedStocks = stocks.map((stock) => {
      // Handle null safely for From
      const from = stock.From
        ? {
            _id: stock.From._id,
            GodownType: stock.From.GodownType,
            GodownName: decryptData(stock.From.GodownName),
          }
        : null;
        console.log(from,"efewf")
   
      // Handle null safely for To
      const to = stock.To
        ? {
            _id: stock.To._id,
            GodownType: stock.To.GodownType,
            GodownName: decryptData(stock.To.GodownName),
          }
        : null;
      console.log(to,"efewf")
      // Handle ItemName population
      const items =
        Array.isArray(stock.ItemName) && stock.ItemName.length > 0
          ? stock.ItemName.map((item) => ({
              _id: item._id,
              itemName: decryptData(item.itemName),
            }))
          : [];

      return {
        _id: stock._id,
        transferdate: stock.transferdate,
        QuantityTotransfer: stock.QuantityTotransfer,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
        From: from,
        To: to,
        ItemName: items,
      };
    });

    return res
      .status(200)
      .json(successResponse(200, "All stocks fetched", null, true, decryptedStocks));
  } catch (error) {
    console.error("Get All Stocks Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, error.message || "Internal server error", false));
  }
};


  export const getOurAllStocks = async (req, res) => {
    try {
      const user=req.user
      const stocks = await Stocktransfer.find({userId:user})
        .populate("From", "GodownName GodownType")
        .populate("To", "GodownName GodownType")
        .populate("ItemName", "itemName")
        .sort({ createdAt: -1 });
  
      // Decrypt fields
      const decryptedStocks = stocks.map((stock) => ({
        _id: stock._id,
        transferdate: stock.transferdate,
        QuantityTotransfer: stock.QuantityTotransfer,
        createdAt: stock.createdAt,
        updatedAt: stock.updatedAt,
       From: stock.From
        ? {
            ...stock.From._doc,
            GodownName: stock.From?.GodownName
              ? decryptData(stock.From.GodownName)
              : null,
          }
        : null,
      To: stock.To
        ? {
            ...stock.To._doc,
            GodownName: stock.To?.GodownName
              ? decryptData(stock.To.GodownName)
              : null,
          }
        : null,
      ItemName: Array.isArray(stock.ItemName)
        ? stock.ItemName.map((item) => ({
            ...item._doc,
            itemName: item?.itemName ? decryptData(item.itemName) : null,
          }))
        : [],
    }));

  
      return res
        .status(200)
        .json(successResponse(200, "All stocks fetched", null, true, decryptedStocks));
    } catch (error) {
      console.error("Get All Stocks Error:", error);
      return res
        .status(500)
        .json(errorResponse(500, error.message || "Internal server error", false));
    }
  };
  
  export const getStockById = async (req, res) => {
    try {
      const { id } = req.params;
      const stock = await Stocktransfer.findById(id)
        .populate("From", "GodownName GodownType")
        .populate("To", "GodownName GodownType")
        .populate("ItmeName");
  
      if (!stock)
        return res.status(404).json(errorResponse(404, "Stock not found", false));
  
      return res.status(200).json(successResponse(200, "Stock fetched", null, true, stock));
    } catch (error) {
      console.error("Get Stock By ID Error:", error);
      return res.status(500).json(errorResponse(500, error.message, false));
    }
  };
  

  export const updateStock = async (req, res) => {
    try {
      const { id } = req.params;
    //   const { body } = req.body;
    //   const decrypted = JSON.parse(decryptData(body));
  
      const {
        transferdate,
        From,
        To,
        ItemName,
        QuantityTotransfer
      } = req.decryptedBody;
  
      const updatedStock = await Stocktransfer.findByIdAndUpdate(
        id,
        { transferdate, From, To, ItemName, QuantityTotransfer },
        { new: true }
      );
  } catch (error) {
    console.error("Create Stock Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


export const deleteStock = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Stocktransfer.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json(errorResponse(404, "Stock not found", false));

    return res
      .status(200)
      .json(
        successResponse(200, "Stock deleted successfully", null, true, deleted)
      );
  } catch (error) {
    console.error("Delete Stock Error:", error);
    return res.status(500).json(errorResponse(500, error.message, false));
  }
};


export const getNotdefaultAllStocks = async (req, res) => {
  try {
    const user = req.user;
    
    const stocks = await Stocktransfer.find({ userId: user })
      .populate({
        path: "From", 
        select: "GodownName GodownType",
        match: { GodownType: { $ne: "Main Store" } }  
      })
      .populate({
        path: "To", 
        select: "GodownName GodownType",
        match: { GodownType: { $ne: "Main Store" } }  
      })
      .populate({
        path: "ItemName", 
        select: "itemName"
      })
      .sort({ createdAt: -1 });

    const decryptedStocks = stocks.map((stock) => ({
      _id: stock._id,
      transferdate: stock.transferdate,
      QuantityTotransfer: stock.QuantityTotransfer,
      createdAt: stock.createdAt,
      updatedAt: stock.updatedAt,
      From: stock.From ? {
        ...stock.From._doc,
        GodownName: decryptData(stock.From?.GodownName),
      } : null,  
      To: stock.To ? {
        ...stock.To._doc,
        GodownName: decryptData(stock.To?.GodownName),
      } : null,  
      ItemName: stock.ItemName.map((item) => ({
        ...item._doc,
        itemName: decryptData(item.itemName),
      })),
    }));

    return res.status(200).json(successResponse(200, "All stocks fetched", null, true, decryptedStocks));
  } catch (error) {
    console.error("Get All Stocks Error:", error);
    return res.status(500).json(errorResponse(500, error.message || "Internal server error", false));
  }
};
