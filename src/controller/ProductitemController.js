import Productitem from "../models/Productitem.js";
import CategoryItem from "../models/CatagoryItem.js";
import PrimaryUnit from "../models/PrimaryUnit.js";
import SecondaryUnit from "../models/SecondaryUnit.js";
import ItemCode from "../models/itemCode.js";
import Gst from "../models/Gst.js";
import Godown from "../models/Godown.js";
import { encryptData, decryptData } from "../lib/encrypt.js";
import { successResponse, errorResponse } from "../lib/reply.js";
import { logStockEvent } from "../utils/stockLog.js";
import stocklogSchema from "../models/stocklogSchema.js";

// export const createProduct = async (req, res) => {
//   try {
//     const user = req.user;
//     const {
//       itemName,
//       itemHSN,
//       selectUnit,
//       itemImage,
//       category,
//       Godownid,
//       itemCode,
//       pricing,
//       stock,
//       onlineStore,
//     } = req.decryptedBody;

//     // Required field validations
//     if (
//       !itemName ||
//       !category ||
//       !itemCode ||
//       !pricing ||
//       !stock ||
//       !Godownid
//     ) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields.", false));
//     }

//     // Pricing validation
//     if (
//       !pricing?.salePrice?.withTax &&
//       !pricing?.salePrice?.withoutTax &&
//       !pricing?.purchasePrice?.withTax &&
//       !pricing?.purchasePrice?.withoutTax
//     ) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             "Either salePrice or purchasePrice must be provided.",
//             false
//           )
//         );
//     }

//     // Fetch and validate references
//     const [categoryDoc, baseUnitDoc, secondaryUnitDoc, taxRateDoc, godownDoc] =
//       await Promise.all([
//         CategoryItem.findById(category),
//         selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
//         selectUnit?.secondaryUnit
//           ? SecondaryUnit.findById(selectUnit.secondaryUnit)
//           : null,
//         pricing?.taxRate ? Gst.findById(pricing.taxRate) : null,
//         Godown.findById(Godownid),
//       ]);

//     if (!categoryDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid CategoryItem ID.", false));
//     }
//     if (!godownDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Godown ID.", false));
//     }
//     if (selectUnit?.baseUnit && !baseUnitDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Base Unit ID.", false));
//     }
//     if (selectUnit?.secondaryUnit && !secondaryUnitDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Secondary Unit ID.", false));
//     }
//     if (pricing?.taxRate && !taxRateDoc) {
//       return res.status(400).json(errorResponse(400, "Invalid GST ID.", false));
//     }

//     // Helper to encrypt non-null values
//     const safeEncrypt = (value) =>
//       value !== undefined && value !== null
//         ? encryptData(value)?.encryptedData
//         : undefined;

//     // Prepare product data
//     const productData = {
//       userId: user,
//       itemName: safeEncrypt(itemName),
//       itemHSN: safeEncrypt(itemHSN),
//       itemImage: safeEncrypt(itemImage),
//       category: categoryDoc._id,
//       Godownid: godownDoc._id, // No encryption required for Godownid
//       itemCode,
//       selectUnit: {
//         baseUnit: baseUnitDoc?._id,
//         secondaryUnit: secondaryUnitDoc?._id,
//         conversionRate: safeEncrypt(
//           selectUnit?.conversionRate
//             ? JSON.stringify(selectUnit.conversionRate)
//             : undefined
//         ),
//       },
//       pricing: {
//         salePrice: {
//           withTax: safeEncrypt(pricing?.salePrice?.withTax),
//           withoutTax: safeEncrypt(pricing?.salePrice?.withoutTax),
//           discount: {
//             type: pricing?.salePrice?.discount?.type,
//             value: safeEncrypt(pricing?.salePrice?.discount?.value),
//           },
//         },
//         purchasePrice: {
//           withTax: safeEncrypt(pricing?.purchasePrice?.withTax),
//           withoutTax: safeEncrypt(pricing?.purchasePrice?.withoutTax),
//         },
//         taxRate: taxRateDoc?._id,
//       },
//       stock: {
//         openingQuantity: safeEncrypt(stock?.openingQuantity),
//         atPrice: safeEncrypt(stock?.atPrice),
//         asOfDate: stock?.asOfDate,
//         minStockToMaintain: safeEncrypt(stock?.minStockToMaintain),
//         location: safeEncrypt(stock?.location),
//       },
//       onlineStore: {
//         onlineStorePrice: safeEncrypt(onlineStore?.onlineStorePrice),
//         description: safeEncrypt(onlineStore?.description),
//       },
//     };

//     const newProduct = new Productitem(productData);
//     await newProduct.save();

//     return res
//       .status(201)
//       .json(successResponse(201, "Product created successfully", "", true));
//   } catch (error) {
//     console.error(error, "error");
//     return res
//       .status(500)
//       .json(errorResponse(500, "Internal server error.", false));
//   }
// };

export const createProduct = async (req, res) => {
  try {
    const user = req.user;
    console.log(user, "hello User");
    const {
      itemName,
      itemHSN,
      selectUnit,
      itemImage,
      category,
      Godownid,
      itemCode,
      pricing,
      stock,
      onlineStore,
    } = req.decryptedBody;

    if (
      !itemName ||
      !category ||
      !itemCode ||
      !pricing ||
      !stock ||
      !Godownid
    ) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields.", false));
    }

    if (
      !pricing?.salePrice?.withTax &&
      !pricing?.salePrice?.withoutTax &&
      !pricing?.purchasePrice?.withTax &&
      !pricing?.purchasePrice?.withoutTax
    ) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "Either salePrice or purchasePrice must be provided.",
            false
          )
        );
    }

    const itemencrypted = encryptData(itemName)?.encryptedData;
    const itemCodeencrypted = encryptData(itemCode)?.encryptedData;
    const findDuplicate = await Productitem.findOne({
      userId: user,
      itemName: itemencrypted,
      itemCode: itemCodeencrypted,
    });
    if (findDuplicate) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "",
            false,
            "this itemName or itemcode Already Exist"
          )
        );
    }

    // Validate references
    const [categoryDoc, baseUnitDoc, secondaryUnitDoc, taxRateDoc, godownDoc] =
      await Promise.all([
        CategoryItem.findById(category),
        selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
        selectUnit?.secondaryUnit
          ? SecondaryUnit.findById(selectUnit.secondaryUnit)
          : null,
        pricing?.taxRate ? Gst.findById(pricing.taxRate) : null,
        Godown.findById(Godownid),
      ]);

    if (!categoryDoc || !godownDoc) {
      return res
        .status(400)
        .json(errorResponse(400, "", "Invalid category or godown."));
    }

    const safeEncrypt = (value) =>
      value !== undefined && value !== null
        ? encryptData(value)?.encryptedData
        : undefined;

    const productData = {
      userId: user,
      itemName: safeEncrypt(itemName),
      itemHSN: safeEncrypt(itemHSN),
      // itemImage: safeEncrypt(itemImage),
       itemImage: Array.isArray(itemImage)
        ? itemImage.map((img) => encryptData(img)?.encryptedData)
        : [],
      category: categoryDoc._id,
      Godownid: godownDoc._id,
      itemCode,
      selectUnit: {
        baseUnit: baseUnitDoc?._id,
        secondaryUnit: secondaryUnitDoc?._id,
        conversionRate: safeEncrypt(
          selectUnit?.conversionRate
            ? JSON.stringify(selectUnit.conversionRate)
            : undefined
        ),
      },
      pricing: {
        salePrice: {
          withTax: safeEncrypt(pricing?.salePrice?.withTax),
          withoutTax: safeEncrypt(pricing?.salePrice?.withoutTax),
          discount: {
            type: pricing?.salePrice?.discount?.type,
            value: safeEncrypt(pricing?.salePrice?.discount?.value),
          },
        },
        purchasePrice: {
          withTax: safeEncrypt(pricing?.purchasePrice?.withTax),
          withoutTax: safeEncrypt(pricing?.purchasePrice?.withoutTax),
        },
        taxRate: taxRateDoc?._id,
      },
      stock: {
        openingQuantity: safeEncrypt(stock?.openingQuantity),
        atPrice: safeEncrypt(stock?.atPrice),
        asOfDate: stock?.asOfDate,
        minStockToMaintain: safeEncrypt(stock?.minStockToMaintain),
        location: safeEncrypt(stock?.location),
        stockQuantity: stock?.openingQuantity,
        availableForSale: stock?.openingQuantity,
        stockValue: (
          parseFloat(stock?.openingQuantity || 0) *
          parseFloat(stock?.atPrice || 0)
        ).toString(),
      },
      onlineStore: {
        onlineStorePrice: safeEncrypt(onlineStore?.onlineStorePrice),
        description: safeEncrypt(onlineStore?.description),
      },
    };

    // Save new product
    const newProduct = new Productitem(productData);
    await newProduct.save();

    // Log stock opening event
    const openingQty = parseFloat(stock?.openingQuantity || "0");
    const price = parseFloat(stock?.atPrice || "0");
    const stockValue = openingQty * price;

    // Call stock logging
    await logStockEvent({
      itemId: newProduct._id,
      godownId: godownDoc._id,
      type: "Opening",
      referenceNo: "Initial Stock",
      status: "Paid",
      quantity: openingQty,
      pricePerUnit: price,
      createdBy: user,
      date: stock?.asOfDate || new Date(),
      data: {
        location: stock?.location || "",
      },
    });

    await logEditHistory({
      itemId: newProduct._id,
      oldValues: {
        quantity: 0,
        pricePerUnit: 0,
      },
      newValues: {
        quantity: openingQty,
        pricePerUnit: price,
      },
      operationType: "Opening",
      createdBy: user,
    });

    return res
      .status(201)
      .json(successResponse(201, "Product created successfully", "", true, ""));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500,  "something went wrong",false));
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       itemName,
//       itemHSN,
//       selectUnit,
//       itemImage,
//       category,
//       Godownid,
//       itemCode,
//       pricing,
//       stock,
//       onlineStore,
//     } = req.decryptedBody;

//     if (!id) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Product ID is required.", false));
//     }

//     // Validate mandatory fields
//     if (
//       !itemName ||
//       !category ||
//       !itemCode ||
//       !pricing ||
//       !stock ||
//       !Godownid
//     ) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields.", false));
//     }

//     // Pricing validation
//     if (
//       !pricing?.salePrice?.withTax &&
//       !pricing?.salePrice?.withoutTax &&
//       !pricing?.purchasePrice?.withTax &&
//       !pricing?.purchasePrice?.withoutTax
//     ) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             "Either salePrice or purchasePrice must be provided.",
//             false
//           )
//         );
//     }

//     // Validate references
//     const [categoryDoc, baseUnitDoc, secondaryUnitDoc, taxRateDoc, godownDoc] =
//       await Promise.all([
//         CategoryItem.findById(category),
//         selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
//         selectUnit?.secondaryUnit
//           ? SecondaryUnit.findById(selectUnit.secondaryUnit)
//           : null,
//         pricing?.taxRate ? Gst.findById(pricing.taxRate) : null,
//         Godown.findById(Godownid),
//       ]);

//     if (!categoryDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid CategoryItem ID.", false));
//     }
//     if (!godownDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Godown ID.", false));
//     }
//     if (selectUnit?.baseUnit && !baseUnitDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Base Unit ID.", false));
//     }
//     if (selectUnit?.secondaryUnit && !secondaryUnitDoc) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid Secondary Unit ID.", false));
//     }
//     if (pricing?.taxRate && !taxRateDoc) {
//       return res.status(400).json(errorResponse(400, "Invalid GST ID.", false));
//     }

//     const safeEncrypt = (value) =>
//       value !== undefined && value !== null
//         ? encryptData(value)?.encryptedData
//         : undefined;

//     const updatedData = {
//       itemName: safeEncrypt(itemName),
//       itemHSN: safeEncrypt(itemHSN),
//       itemImage: safeEncrypt(itemImage),
//       category: categoryDoc._id,
//       Godownid: godownDoc._id,
//       itemCode,
//       selectUnit: {
//         baseUnit: baseUnitDoc?._id,
//         secondaryUnit: secondaryUnitDoc?._id,
//         conversionRate: safeEncrypt(
//           selectUnit?.conversionRate
//             ? JSON.stringify(selectUnit.conversionRate)
//             : undefined
//         ),
//       },
//       pricing: {
//         salePrice: {
//           withTax: safeEncrypt(pricing?.salePrice?.withTax),
//           withoutTax: safeEncrypt(pricing?.salePrice?.withoutTax),
//           discount: {
//             type: pricing?.salePrice?.discount?.type,
//             value: safeEncrypt(pricing?.salePrice?.discount?.value),
//           },
//         },
//         purchasePrice: {
//           withTax: safeEncrypt(pricing?.purchasePrice?.withTax),
//           withoutTax: safeEncrypt(pricing?.purchasePrice?.withoutTax),
//         },
//         taxRate: taxRateDoc?._id,
//       },
//       stock: {
//         openingQuantity: safeEncrypt(stock?.openingQuantity),
//         atPrice: safeEncrypt(stock?.atPrice),
//         asOfDate: stock?.asOfDate,
//         minStockToMaintain: safeEncrypt(stock?.minStockToMaintain),
//         location: safeEncrypt(stock?.location),
//       },

//       onlineStore: {
//         onlineStorePrice: safeEncrypt(onlineStore?.onlineStorePrice),
//         description: safeEncrypt(onlineStore?.description),
//       },
//     };

//     const updatedProduct = await Productitem.findByIdAndUpdate(
//       id,
//       updatedData,
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found.", false));
//     }

//     return res
//       .status(200)
//       .json(successResponse(200, "Product updated successfully", "", true));
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Internal server error.", false));
//   }
// };

export const updateProduct = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const {
      itemName,
      itemHSN,
      selectUnit,
      itemImage,
      category,
      Godownid,
      itemCode,
      pricing,
      stock,
      onlineStore,
    } = req.decryptedBody;

    const product = await Productitem.findOne({ _id: id, userId: user });
    if (!product) {
      return res
        .status(404)
        .json(errorResponse(404, "Product not found.", false));
    }

    const [categoryDoc, baseUnitDoc, secondaryUnitDoc, taxRateDoc, godownDoc] =
      await Promise.all([
        CategoryItem.findById(category),
        selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
        selectUnit?.secondaryUnit
          ? SecondaryUnit.findById(selectUnit.secondaryUnit)
          : null,
        pricing?.taxRate ? Gst.findById(pricing.taxRate) : null,
        Godown.findById(Godownid),
      ]);

    if (!categoryDoc || !godownDoc) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid category or godown.", false));
    }
    const itemencrypted = encryptData(itemName)?.encryptedData;
    const itemCodeencrypted = encryptData(itemCode)?.encryptedData;
    const findDuplicate = await Productitem.findOne({
      userId: user,
      _id: { $ne: id },
      itemName: itemencrypted,
      itemCode: itemCodeencrypted,
    });
    if (findDuplicate) {
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            "",
            false,
            "this itemName or itemcode Already Exist"
          )
        );
    }
    const safeEncrypt = (value) =>
      value !== undefined && value !== null
        ? encryptData(value)?.encryptedData
        : undefined;

    // Update product fields
    product.itemName = safeEncrypt(itemName);
    product.itemHSN = safeEncrypt(itemHSN);
    // product.itemImage = safeEncrypt(itemImage);
      product.itemImage = Array.isArray(itemImage)
      ? itemImage.map((img) => encryptData(img)?.encryptedData)
      : [];
    product.category = categoryDoc._id;
    product.Godownid = godownDoc._id;
    product.itemCode = itemCode;

    product.selectUnit = {
      baseUnit: baseUnitDoc?._id,
      secondaryUnit: secondaryUnitDoc?._id,
      conversionRate: safeEncrypt(
        selectUnit?.conversionRate
          ? JSON.stringify(selectUnit.conversionRate)
          : undefined
      ),
    };

    product.pricing = {
      salePrice: {
        withTax: safeEncrypt(pricing?.salePrice?.withTax),
        withoutTax: safeEncrypt(pricing?.salePrice?.withoutTax),
        discount: {
          type: pricing?.salePrice?.discount?.type,
          value: safeEncrypt(pricing?.salePrice?.discount?.value),
        },
      },
      purchasePrice: {
        withTax: safeEncrypt(pricing?.purchasePrice?.withTax),
        withoutTax: safeEncrypt(pricing?.purchasePrice?.withoutTax),
      },
      taxRate: taxRateDoc?._id,
    };

    product.stock = {
      openingQuantity: safeEncrypt(stock?.openingQuantity),
      atPrice: safeEncrypt(stock?.atPrice),
      asOfDate: stock?.asOfDate,
      minStockToMaintain: safeEncrypt(stock?.minStockToMaintain),
      location: safeEncrypt(stock?.location),
      stockQuantity: stock?.openingQuantity,
      availableForSale: stock?.openingQuantity,
      stockValue: (
        parseFloat(stock?.openingQuantity || 0) *
        parseFloat(stock?.atPrice || 0)
      ).toString(),
    };

    product.onlineStore = {
      onlineStorePrice: safeEncrypt(onlineStore?.onlineStorePrice),
      description: safeEncrypt(onlineStore?.description),
    };

    await product.save();

    await logEditHistory({
      itemId: product._id,
      operationType: "Update",
      createdBy: user,
      newValues: {
        quantity: parseFloat(stock?.openingQuantity || 0),
        pricePerUnit: parseFloat(stock?.atPrice || 0),
      },
      oldValues: {}, // Optionally fetch & record old values if needed
    });

    return res
      .status(200)
      .json(successResponse(200, "Product updated successfully", "", true));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error.", false));
  }
};

export const getAllProductItems = async (req, res) => {
  try {
    const products = await Productitem.find()
      .populate("category")
      .populate("pricing.taxRate")
      .populate("Godownid")
      .populate("selectUnit.baseUnit")
      .populate("selectUnit.secondaryUnit");

    const decryptedProducts = products.map((product) => {
      return {
        _id: product._id,
        itemName: decryptData(product.itemName),
        itemHSN: decryptData(product.itemHSN),
        itemImage: decryptData(product.itemImage),
        category: product.category
          ? {
              _id: product.category._id,
              name: decryptData(product.category.name),
              userId: product.category.userId,
              status: product.category.status,
              createdAt: product.category.createdAt,
              updatedAt: product.category.updatedAt,
            }
          : null,
        itemCode: product.itemCode,
        Godownid: {
          _id: product.Godownid?._id,
          GodownType: product.Godownid?.GodownType,
          GodownName: decryptData(product.Godownid?.GodownName),
          emailId: decryptData(product.Godownid?.emailId),
          PhnNo: decryptData(product.Godownid?.PhnNo),
          gstIn: decryptData(product.Godownid?.gstIn),
          GodownAddress: decryptData(product.Godownid?.GodownAddress),
          GodownPincode: decryptData(product.Godownid?.GodownPincode),
        },

        selectUnit: {
          baseUnit: product.selectUnit?.baseUnit
            ? {
                _id: product.selectUnit.baseUnit._id,
                name: decryptData(product.selectUnit.baseUnit.name),
                status: product.selectUnit.baseUnit.status,
              }
            : null,
          secondaryUnit: product.selectUnit?.secondaryUnit
            ? {
                _id: product.selectUnit.secondaryUnit._id,
                name: decryptData(product.selectUnit.secondaryUnit.name),
                status: product.selectUnit.secondaryUnit.status,
              }
            : null,
          conversionRate: product.selectUnit?.conversionRate
            ? JSON.parse(decryptData(product.selectUnit.conversionRate))
            : null,
        },
        pricing: {
          salePrice: {
            withTax: decryptData(product.pricing?.salePrice?.withTax),
            withoutTax: decryptData(product.pricing?.salePrice?.withoutTax),
            discount: {
              type: product.pricing?.salePrice?.discount?.type,
              value: decryptData(product.pricing?.salePrice?.discount?.value),
            },
          },
          purchasePrice: {
            withTax: decryptData(product.pricing?.purchasePrice?.withTax),
            withoutTax: decryptData(product.pricing?.purchasePrice?.withoutTax),
          },
          taxRate: product.pricing?.taxRate
            ? {
                _id: product.pricing.taxRate._id,
                label: decryptData(product.pricing.taxRate.label),
                rate: decryptData(product.pricing.taxRate.rate),
                status: product.pricing.taxRate.status,
                createdAt: product.pricing.taxRate.createdAt,
                updatedAt: product.pricing.taxRate.updatedAt,
              }
            : null,
        },
        stock: {
          openingQuantity: decryptData(product.stock?.openingQuantity),
          atPrice: decryptData(product.stock?.atPrice),
          asOfDate: product.stock?.asOfDate,
          minStockToMaintain: decryptData(product.stock?.minStockToMaintain),
          location: decryptData(product.stock?.location),
          stockQuantity: product.stock?.stockQuantity,
          availableForSale: product.stock?.availableForSale,
          stockValue: product.stock?.stockValue,
        },
        onlineStore: {
          onlineStorePrice: decryptData(product.onlineStore?.onlineStorePrice),
          description: decryptData(product.onlineStore?.description),
        },
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Products fetched successfully",
          "",
          true,
          decryptedProducts
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error.", false));
  }
};

export const getOurAllProductItems = async (req, res) => {
  try {
    const user = req.user;

    const products = await Productitem.find({ userId: user })
      .populate("category")
      .populate("pricing.taxRate")
      .populate("Godownid")
      .populate("selectUnit.baseUnit")
      .populate("selectUnit.secondaryUnit");

    const decryptedProducts = products.map((product) => {
      return {
        _id: product._id,
        itemName: product.itemName ? decryptData(product.itemName) : null,
        itemHSN: product.itemHSN ? decryptData(product.itemHSN) : null,
        // itemImage: product.itemImage ? decryptData(product.itemImage) : null,
        itemImage: Array.isArray(product.itemImage)
            ? product.itemImage.map((img) => decryptData(img))
            : [],
        category: product.category
          ? {
              _id: product.category._id,
              name: product.category?.name
                ? decryptData(product.category.name)
                : null, // Decrypt category name here
              userId: product.category.userId,
              status: product.category.status,
              createdAt: product.category.createdAt,
              updatedAt: product.category.updatedAt,
            }
          : null,
        itemCode: product.itemCode,
        Godownid: {
          _id: product.Godownid?._id,
          GodownType: product.Godownid?.GodownType,
          GodownName: product.Godownid?.GodownName
            ? decryptData(product.Godownid.GodownName)
            : null,
          emailId: product.Godownid?.emailId
            ? decryptData(product.Godownid.emailId)
            : null,
          PhnNo: product.Godownid?.PhnNo
            ? decryptData(product.Godownid.PhnNo)
            : null,
          gstIn: product.Godownid?.gstIn
            ? decryptData(product.Godownid.gstIn)
            : null,
          GodownAddress: product.Godownid?.GodownAddress
            ? decryptData(product.Godownid.GodownAddress)
            : null,
          GodownPincode: product.Godownid?.GodownPincode
            ? decryptData(product.Godownid.GodownPincode)
            : null,
        },
        selectUnit: {
          baseUnit: product.selectUnit?.baseUnit
            ? {
                _id: product.selectUnit.baseUnit._id,
                name: product.selectUnit.baseUnit.name
                  ? decryptData(product.selectUnit.baseUnit.name)
                  : null,
                status: product.selectUnit.baseUnit.status,
              }
            : null,
          secondaryUnit: product.selectUnit?.secondaryUnit
            ? {
                _id: product.selectUnit.secondaryUnit._id,
                name: product.selectUnit.secondaryUnit.name
                  ? decryptData(product.selectUnit.secondaryUnit.name)
                  : null,
                status: product.selectUnit.secondaryUnit.status,
              }
            : null,
          conversionRate: product.selectUnit?.conversionRate
            ? JSON.parse(decryptData(product.selectUnit.conversionRate))
            : null,
        },

        pricing: {
          salePrice: {
            withTax: product.pricing?.salePrice?.withTax
              ? decryptData(product.pricing.salePrice.withTax)
              : null,
            withoutTax: product.pricing?.salePrice?.withoutTax
              ? decryptData(product.pricing.salePrice.withoutTax)
              : null,
            discount: {
              type: product.pricing?.salePrice?.discount?.type || null,
              value: product.pricing?.salePrice?.discount?.value
                ? decryptData(product.pricing.salePrice.discount.value)
                : null,
            },
          },
          purchasePrice: {
            withTax: product.pricing?.purchasePrice?.withTax
              ? decryptData(product.pricing.purchasePrice.withTax)
              : null,
            withoutTax: product.pricing?.purchasePrice?.withoutTax
              ? decryptData(product.pricing.purchasePrice.withoutTax)
              : null,
          },
          taxRate: product.pricing?.taxRate
            ? {
                _id: product.pricing.taxRate._id,
                label: product.pricing.taxRate.label
                  ? decryptData(product.pricing.taxRate.label)
                  : null,
                rate: product.pricing.taxRate.rate
                  ? decryptData(product.pricing.taxRate.rate)
                  : null,
                status: product.pricing.taxRate.status,
                createdAt: product.pricing.taxRate.createdAt,
                updatedAt: product.pricing.taxRate.updatedAt,
              }
            : null,
        },

        stock: {
          openingQuantity: product.stock?.openingQuantity
            ? decryptData(product.stock.openingQuantity)
            : null,
          atPrice: product.stock?.atPrice
            ? decryptData(product.stock.atPrice)
            : null,
          asOfDate: product.stock?.asOfDate || null,
          minStockToMaintain: product.stock?.minStockToMaintain
            ? decryptData(product.stock.minStockToMaintain)
            : null,
          location: product.stock?.location
            ? decryptData(product.stock.location)
            : null,
          stockQuantity: product.stock?.stockQuantity,
          availableForSale: product.stock?.availableForSale,
          stockValue: product.stock?.stockValue,
        },
        stockHistory: stocklogSchema ? stocklogSchema.editHistory : [],
        onlineStore: {
          onlineStorePrice: product.onlineStore?.onlineStorePrice
            ? decryptData(product.onlineStore.onlineStorePrice)
            : null,
          description: product.onlineStore?.description
            ? decryptData(product.onlineStore.description)
            : null,
        },

        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    });

    return res
      .status(200)
      .json(
        successResponse(
          200,
          "Products fetched successfully",
          "",
          true,
          decryptedProducts
        )
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong.", false));
  }
};

export const getProductitemById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Productitem.findById(id)
      .populate("category")
      .populate("itemCode")
      .populate("selectUnit.baseUnit")
      .populate("selectUnit.secondaryUnit")
      .populate("pricing.taxRate")
      .lean();

    if (!product) {
      return res
        .status(404)
        .json(errorResponse(404, "Product not found.", false));
    }

    const decryptedProduct = {
      ...product,
      itemName: product.itemName ? decryptData(product.itemName) : null,
      itemHSN: product.itemHSN ? decryptData(product.itemHSN) : null,
      itemImage: product.itemImage,
      selectUnit: {
        baseUnit: product.selectUnit?.baseUnit
          ? decryptData(product.selectUnit.baseUnit.name)
          : null,
        secondaryUnit: product.selectUnit?.secondaryUnit
          ? decryptData(product.selectUnit.secondaryUnit.name)
          : null,
        conversionRate: product.selectUnit?.conversionRate
          ? decryptData(product.selectUnit.conversionRate)
          : null,
      },
      category: product.category ? decryptData(product.category.name) : null,
      itemCode: product.itemCode ? decryptData(product.itemCode.code) : null,
      pricing: {
        salePrice: {
          withTax: product.pricing?.salePrice?.withTax
            ? decryptData(product.pricing.salePrice.withTax)
            : null,
          withoutTax: product.pricing?.salePrice?.withoutTax
            ? decryptData(product.pricing.salePrice.withoutTax)
            : null,
          discount: {
            type: product.pricing?.salePrice?.discount?.type,
            value: product.pricing?.salePrice?.discount?.value
              ? decryptData(product.pricing.salePrice.discount.value)
              : null,
          },
        },
        purchasePrice: {
          withTax: product.pricing?.purchasePrice?.withTax
            ? decryptData(product.pricing.purchasePrice.withTax)
            : null,
          withoutTax: product.pricing?.purchasePrice?.withoutTax
            ? decryptData(product.pricing.purchasePrice.withoutTax)
            : null,
        },
        taxRate: product.pricing?.taxRate
          ? decryptData(product.pricing.taxRate.label)
          : null,
      },
      stock: {
        openingQuantity: product.stock?.openingQuantity
          ? decryptData(product.stock.openingQuantity)
          : null,
        atPrice: product.stock?.atPrice
          ? decryptData(product.stock.atPrice)
          : null,
        asOfDate: product.stock?.asOfDate,
        minStockToMaintain: product.stock?.minStockToMaintain
          ? decryptData(product.stock.minStockToMaintain)
          : null,
        location: product.stock?.location
          ? decryptData(product.stock.location)
          : null,
      },
      onlineStore: {
        onlineStorePrice: product.onlineStore?.onlineStorePrice
          ? decryptData(product.onlineStore.onlineStorePrice)
          : null,
        description: product.onlineStore?.description
          ? decryptData(product.onlineStore.description)
          : null,
      },
    };

    return res
      .status(200)
      .json(
        successResponse(200, "Product fetched successfully.", decryptedProduct)
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error.", false));
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Productitem.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json(errorResponse(404, "Product not found.", false));
    }

    return res
      .status(200)
      .json(successResponse(200, "Product deleted successfully.", true));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error.", false));
  }
};

// ###*************************************************stock adjust item here starts **********************************************************************************

// export const updateStockByType = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { itemId } = req.params;
//     const {
//       godownId,
//       quantity,
//       pricePerUnit,
//       type,
//       referenceNo,
//       status = "Paid",
//       createdBy,
//       date,
//       data = {},
//     } = parsed;

//     const item = await Productitem.findById(itemId);
//     if (!item) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found", false));
//     }

//     if (isNaN(quantity) || isNaN(pricePerUnit)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
//     }

//     const reduceQty = parseFloat(quantity);
//     const price = parseFloat(pricePerUnit);

//     let oldValues = {
//       quantity: parseFloat(item.stock.stockQuantity || "0"),
//       pricePerUnit: parseFloat(
//         item.stock.stockValue / parseFloat(item.stock.stockQuantity || "1")
//       ),
//     };

//     let newValues = {
//       quantity: 0,
//       pricePerUnit: 0,
//     };

//     if (type === "Opening") {
//       const openingQty = reduceQty;
//       const stockValue = openingQty * price;

//       item.stock.openingQuantity = openingQty.toString();
//       item.stock.stockQuantity = openingQty.toString();
//       item.stock.availableForSale = openingQty.toString();
//       item.stock.stockValue = stockValue.toString();

//       newValues.quantity = openingQty;
//       newValues.pricePerUnit = price;

//       await item.save();

//       // Log the history
//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: openingQty,
//         pricePerUnit: price,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Opening",
//         createdBy,
//       });
//   const updatedItem = await Productitem.findById(itemId);
//       const stockQty = parseFloat(updatedItem.stock.stockQuantity || "0");
//       const stockVal = parseFloat(updatedItem.stock.stockValue || "0");
//       const updatedPricePerUnit = stockQty > 0 ? stockVal / stockQty : 0;
//       return res.status(200).json(
//         successResponse(200, "Opening stock set successfully", null, true, {
//           _id: updatedItem._id,
//           stock: {
//             ...updatedItem.stock.toObject(),
//             stockQuantity: stockQty.toString(),
//             stockValue: stockVal.toString(),
//             pricePerUnit: updatedPricePerUnit.toFixed(2),
//           },
//         })
//       );
//     }

//     if (type === "Add") {
//        const currentQty = parseFloat(item.stock.stockQuantity || "0");
//   const currentValue = parseFloat(item.stock.stockValue || "0");

//   const newQty = currentQty + reduceQty;
//   const newValue = currentValue + (reduceQty * price);
//   const avgPrice = newQty > 0 ? newValue / newQty : 0;

//   item.stock.stockQuantity = newQty.toString();
//   item.stock.availableForSale = newQty.toString();
//   item.stock.stockValue = newValue.toString();

//   newValues.quantity = newQty;
//   newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Add",
//         createdBy,
//       });
//  const updatedItem = await Productitem.findById(itemId);
//       const stockQty = parseFloat(updatedItem.stock.stockQuantity || "0");
//       const stockVal = parseFloat(updatedItem.stock.stockValue || "0");
//       const updatedPricePerUnit = stockQty > 0 ? stockVal / stockQty : 0;

//       return res.status(200).json(
//         successResponse(200, "Stock added successfully", null, true, {
//           _id: updatedItem._id,
//           stock: {
//             ...updatedItem.stock.toObject(),
//             stockQuantity: stockQty.toString(),
//             stockValue: stockVal.toString(),
//             pricePerUnit: updatedPricePerUnit.toFixed(2),
//           },
//         })
//       );
//     }

//     if (type === "Reduce") {

//  const currentQty = parseFloat(item.stock.stockQuantity || "0");
//   const currentValue = parseFloat(item.stock.stockValue || "0");

//   if (currentQty <= 0 || reduceQty > currentQty) {
//     return res.status(400).json(
//       errorResponse(400, "Insufficient stock to reduce", false)
//     );
//   }

//   const minStock = parseFloat(item.stock.minStockToMaintain || "0");
//   const newQty = currentQty - reduceQty;

//   if (newQty < minStock) {
//     return res.status(400).json(
//       errorResponse(
//         400,
//         "Insufficient stock to reduce below minimum threshold",
//         false
//       )
//     );
//   }

//   const avgPrice = currentQty > 0 ? currentValue / currentQty : 0;
//   const newValue = newQty * avgPrice;

//   item.stock.stockQuantity = newQty.toString();
//   item.stock.availableForSale = newQty.toString();
//   item.stock.stockValue = newValue.toString();

//   newValues.quantity = newQty;
//   newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Reduce",
//         createdBy,
//       });

//       return res
//         .status(200)
//         .json(
//           successResponse(200, "Stock reduced successfully", null, true, item)
//         );
//     }

//     return res
//       .status(400)
//       .json(errorResponse(400, "Invalid operation type", false));
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

// const logEditHistory = async ({
//   itemId,
//   oldValues,
//   newValues,
//   operationType,
//   createdBy,
// }) => {
//   try {
//     const stockLog = await stocklogSchema
//       .findOne({ itemId })
//       .sort({ createdAt: -1 });
//     if (stockLog) {
//       stockLog.editHistory.push({
//         operationType,
//         oldValues,
//         newValues,
//         modifiedBy: createdBy,
//         modifiedAt: new Date(),
//         reason: `${operationType} stock`,
//       });

//       await stockLog.save();
//     }
//   } catch (error) {
//     console.error("Error logging edit history:", error);
//   }
// };

const logEditHistory = async ({
  itemId,
  oldValues,
  newValues,
  operationType,
  createdBy,
}) => {
  try {
    // Try to find the stocklog for the given itemId
    let stockLog = await stocklogSchema.findOne({ itemId });

    // If no stocklog exists, create one
    if (!stockLog) {
      stockLog = new stocklogSchema({
        itemId,
        editHistory: [],
      });
    }

    // Push edit history into the existing (or new) stocklog
    stockLog.editHistory.push({
      operationType,
      oldValues,
      newValues,
      modifiedBy: createdBy,
      modifiedAt: new Date(),
      reason: `${operationType} stock`,
    });

    // Save the stocklog (either new or updated)
    await stockLog.save();
  } catch (error) {
    console.error("Error logging edit history:", error);
  }
};

export const getStockproductHistory = async (req, res) => {
  try {
    const {
      itemId,
      godownId,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    if (itemId) filters.itemId = itemId;
    if (godownId) filters.godownId = godownId;
    if (type) filters.type = type;
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stockLogs = await stocklogSchema
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("itemId", "itemName itemCode")
      .populate("godownId", "GodownName")
      .populate("userId", "name email")
      .populate("editHistory.modifiedBy", "name email")
      .lean();

    for (const log of stockLogs) {
      log.itemId = log.itemId
        ? {
            ...log.itemId,
            itemName: log.itemId.itemName
              ? decryptData(log.itemId.itemName)
              : null,
          }
        : null;

      log.godownId = log.godownId
        ? {
            ...log.godownId,
            GodownName: log.godownId.GodownName
              ? decryptData(log.godownId.GodownName)
              : null,
          }
        : null;
    }
    const totalLogs = await stocklogSchema.countDocuments(filters);

    return res.status(200).json(
      successResponse(200, "Stock history fetched successfully", null, true, {
        stockLogs,
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: parseInt(page),
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const getStockproductHistory = async (req, res) => {
//   try {
//     const {
//       itemId,
//       godownId,
//       type,
//       startDate,
//       endDate,
//       page = 1,
//       limit = 10,
//     } = req.query;

//     const filters = {};

//     if (itemId) filters.itemId = itemId;
//     if (godownId) filters.godownId = godownId;

//     if (type) {
//       filters.type = type;
//     } else {
//       // Include relevant stock change types
//       filters.type = { $in: ["Add", "Reduce", "Opening"] };
//     }

//     if (startDate && endDate) {
//       filters.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const stockLogs = await stocklogSchema
//       .find(filters)
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(parseInt(limit))
//       .populate("itemId", "itemName itemCode")
//       .populate("godownId", "GodownName")
//       .populate("userId", "name email")
//       .populate("editHistory.modifiedBy", "name email")
//       .lean();

//     for (const log of stockLogs) {
//       if (log.itemId?.itemName) {
//         log.itemId.itemName = decryptData(log.itemId.itemName);
//       }
//       if (log.godownId?.GodownName) {
//         log.godownId.GodownName = decryptData(log.godownId.GodownName);
//       }
//     }

//     const totalLogs = await stocklogSchema.countDocuments(filters);

//     return res.status(200).json(
//       successResponse(200, "Stock history fetched successfully", null, true, {
//         stockLogs,
//         totalLogs,
//         totalPages: Math.ceil(totalLogs / limit),
//         currentPage: parseInt(page),
//       })
//     );
//   } catch (error) {
//     console.error("Error fetching stock history:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const getStockproductHistoryById = async (req, res) => {
  try {
    const { itemId } = req.params;
    const {
      godownId,
      type,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    if (!itemId) {
      return res
        .status(400)
        .json(
          errorResponse(400, "itemId is required in URL parameters", false)
        );
    }

    const filters = { itemId };

    if (godownId) filters.godownId = godownId;
    if (type) filters.type = type;
    if (startDate && endDate) {
      filters.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const stockLogs = await stocklogSchema
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("itemId", "itemName itemCode")
      .populate("godownId", "GodownName")
      .populate("userId", "name email")
      .populate("editHistory.modifiedBy", "name email")
      .lean();
    for (const log of stockLogs) {
      log.itemId = log.itemId
        ? {
            ...log.itemId,
            itemName: log.itemId.itemName
              ? decryptData(log.itemId.itemName)
              : null,
          }
        : null;

      log.godownId = log.godownId
        ? {
            ...log.godownId,
            GodownName: log.godownId.GodownName
              ? decryptData(log.godownId.GodownName)
              : null,
          }
        : null;
    }

    const totalLogs = await stocklogSchema.countDocuments(filters);

    return res.status(200).json(
      successResponse(200, "Stock history fetched successfully", null, true, {
        stockLogs,
        totalLogs,
        totalPages: Math.ceil(totalLogs / limit),
        currentPage: parseInt(page),
      })
    );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Productitem.findById(itemId);
    if (!item) {
      return res
        .status(404)
        .json(errorResponse(404, "Product not found", false));
    }

    const stock = item.stock || {};

    return res.status(200).json(
      successResponse(200, "Stock details fetched successfully", null, true, {
        itemId: item._id,
        itemName: item.name,
        stockQuantity: parseFloat(stock.stockQuantity || "0"),
        availableForSale: parseFloat(stock.availableForSale || "0"),
        stockValue: parseFloat(stock.stockValue || "0"),
        openingQuantity: parseFloat(stock.openingQuantity || "0"),
        minStockToMaintain: parseFloat(stock.minStockToMaintain || "0"),
      })
    );
  } catch (error) {
    console.error("Error fetching stock details:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};

// export const adjustStock = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { actionQuantity, actionPrice, actionType } = req.body;
//     const user = req.user;

//     // Ensure all required fields are provided
//     if (!actionQuantity || !actionPrice || !actionType) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields.", false));
//     }

//     // Find the product by itemId
//     const product = await Productitem.findById(itemId);
//     if (!product) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found.", false));
//     }

//     // Get the current stock
//     const currentStock = parseFloat(product.stock.stockQuantity);

//     // Initialize new stock and stock value
//     let newStock, stockValue;

//     // Handle Add action
//     if (actionType === "Add") {
//       newStock = currentStock + parseFloat(actionQuantity);
//     }
//     // Handle Reduce action
//     else if (actionType === "Reduce") {
//       if (currentStock < actionQuantity) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Insufficient stock to reduce.", false));
//       }
//       newStock = currentStock - parseFloat(actionQuantity);
//     } else {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid action type. Use 'Add' or 'Reduce'.", false));
//     }

//     // Calculate the stock value
//     stockValue = newStock * parseFloat(actionPrice);

//     // Update the stock in the database
//     await Productitem.findByIdAndUpdate(itemId, {
//       "stock.stockQuantity": newStock.toString(),
//       "stock.availableForSale": newStock.toString(),
//       "stock.stockValue": stockValue.toString(),
//     });

//     // Log the stock event (either Add or Reduce)
//     await logStockEvent({
//       itemId,
//       godownId: product.Godownid,
//       type: actionType,
//       referenceNo: `${actionType} Stock`,
//       status: "Paid",
//       quantity: actionQuantity,
//       pricePerUnit: actionPrice,
//       createdBy: user,
//       date: new Date(),
//       data: {},
//     });

//     // Log the edit history
//     await logEditHistory({
//       itemId,
//       oldValues: {
//         quantity: currentStock,
//       },
//       newValues: {
//         quantity: newStock,
//       },
//       operationType: actionType,
//       createdBy: user,
//     });

//     return res
//       .status(200)
//       .json(successResponse(200, `${actionType} stock successfully.`, "", true));

//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Internal server error.", false));
//   }
// };

// export const adjustStock = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { quantity, pricePerUnit, type, reason } = parsed;
//     // const user = req.user;

//     if (!quantity || !pricePerUnit || !type) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields.", false));
//     }

//     const product = await Productitem.findById(itemId);
//     if (!product) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found.", false));
//     }

//     const currentStock = parseFloat(product.stock.stockQuantity);

//     let newStock, stockValue;

//     if (type === "Add") {
//       newStock = currentStock + parseFloat(quantity);
//       stockValue = (parseFloat(product.stock.stockValue)) + (parseFloat(quantity) * parseFloat(pricePerUnit));

//     } else if (type === "Reduce") {
//       if (currentStock < quantity) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Insufficient stock to reduce.", false));
//       }
//       newStock = currentStock - parseFloat(quantity);
//      stockValue = (parseFloat(product.stock.stockValue)) - (parseFloat(quantity) * parseFloat(pricePerUnit));
//     } else {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             "Invalid action type. Use 'Add' or 'Reduce'.",
//             false
//           )
//         );
//     }

//     await Productitem.findByIdAndUpdate(itemId, {
//       "stock.stockQuantity": newStock.toString(),
//       "stock.availableForSale": newStock.toString(),
//       "stock.stockValue": stockValue.toString(),
//     });
//  await stocklogSchema.create({
//       type: type,
//       itemId:product._id,
//       godownId: product.Godownid,
//       referenceNo: `${type} Stock`,
//       status: "Paid",
//       quantity: quantity,
//       pricePerUnit: pricePerUnit,
//       // userId: user,
//       date: new Date(),
//       editHistory: [
//         {
//           operationType: type,
//           oldValues: {
//             quantity: currentStock,
//             pricePerUnit: pricePerUnit,
//           },
//           newValues: {
//             quantity: newStock,
//             pricePerUnit: pricePerUnit,
//           },
//           // modifiedBy: {userId:user},
//           reason,
//         },
//       ],
//     });

//     return res
//       .status(200)
//       .json(successResponse(200, `${type} stock successfully.`, "", true));
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Internal server error.", false));
//   }
// };

// export const updateStockByType = async (req, res) => {

//   try {
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { itemId } = req.params;
//     const {
//       godownId,
//       quantity,
//       pricePerUnit,
//       type,
//       referenceNo,
//       status = "Paid",
//       createdBy,
//       date,
//       data = {},
//     } = parsed;

//     const item = await Productitem.findById(itemId);
//     if (!item) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found", false));
//     }

//     if (isNaN(quantity) || isNaN(pricePerUnit)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
//     }

//     const reduceQty = parseFloat(quantity);
//     const price = parseFloat(pricePerUnit);

//     let oldValues = {
//       quantity: parseFloat(item.stock.stockQuantity || "0"),
//       pricePerUnit: parseFloat(
//         item.stock.stockValue / parseFloat(item.stock.stockQuantity || "1")
//       ),
//     };

//     let newValues = {
//       quantity: 0,
//       pricePerUnit: 0,
//     };

//     if (type === "Opening") {
//       const openingQty = reduceQty;
//       const stockValue = openingQty * price;

//       item.stock.openingQuantity = openingQty.toString();
//       item.stock.stockQuantity = openingQty.toString();
//       item.stock.availableForSale = openingQty.toString();
//       item.stock.stockValue = stockValue.toString();

//       newValues.quantity = openingQty;
//       newValues.pricePerUnit = price;

//       await item.save();

//       // Log the history
//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: openingQty,
//         pricePerUnit: price,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Opening",
//         createdBy,
//       });

//       return res
//         .status(200)
//         .json(
//           successResponse(
//             200,
//             "Opening stock set successfully",
//             null,
//             true,
//             item
//           )
//         );
//     }

//     if (type === "Add") {
//        const currentQty = parseFloat(item.stock.stockQuantity || "0");
//   const currentValue = parseFloat(item.stock.stockValue || "0");

//   const newQty = currentQty + reduceQty;
//   const newValue = currentValue + (reduceQty * price);
//   const avgPrice = newQty > 0 ? newValue / newQty : 0;

//   item.stock.stockQuantity = newQty.toString();
//   item.stock.availableForSale = newQty.toString();
//   item.stock.stockValue = newValue.toString();

//   newValues.quantity = newQty;
//   newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Add",
//         createdBy,
//       });

//       return res
//         .status(200)
//         .json(
//           successResponse(200, "Stock added successfully", null, true, item)
//         );
//     }

//     if (type === "Reduce") {

//  const currentQty = parseFloat(item.stock.stockQuantity || "0");
//   const currentValue = parseFloat(item.stock.stockValue || "0");

//   if (currentQty <= 0 || reduceQty > currentQty) {
//     return res.status(400).json(
//       errorResponse(400, "Insufficient stock to reduce", false)
//     );
//   }

//   const minStock = parseFloat(item.stock.minStockToMaintain || "0");
//   const newQty = currentQty - reduceQty;

//   if (newQty < minStock) {
//     return res.status(400).json(
//       errorResponse(
//         400,
//         "Insufficient stock to reduce below minimum threshold",
//         false
//       )
//     );
//   }

//   const avgPrice = currentQty > 0 ? currentValue / currentQty : 0;
//   const newValue = newQty * avgPrice;

//   item.stock.stockQuantity = newQty.toString();
//   item.stock.availableForSale = newQty.toString();
//   item.stock.stockValue = newValue.toString();

//   newValues.quantity = newQty;
//   newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Reduce",
//         createdBy,
//       });

//       return res
//         .status(200)
//         .json(
//           successResponse(200, "Stock reduced successfully", null, true, item)
//         );
//     }

//     return res
//       .status(400)
//       .json(errorResponse(400, "Invalid operation type", false));
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

// export const updateStockByType = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { itemId } = req.params;

//     const {
//       godownId,
//       quantity,
//       pricePerUnit,
//       type,
//       referenceNo,
//       status = "Paid",
//       createdBy,
//       date,
//       data = {},
//     } = parsed;

//     const item = await Productitem.findById(itemId);
//     if (!item) {
//       return res.status(404).json(errorResponse(404, "Product not found", false));
//     }

//     if (isNaN(quantity) || isNaN(pricePerUnit)) {
//       return res.status(400).json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
//     }

//     const reduceQty = parseFloat(quantity);
//     const price = parseFloat(pricePerUnit);

//     let oldValues = {
//       quantity: parseFloat(item.stock.stockQuantity || "0"),
//       pricePerUnit: parseFloat(item.stock.stockValue || "0") / parseFloat(item.stock.stockQuantity || "1"),
//     };

//     let newValues = {
//       quantity: 0,
//       pricePerUnit: 0,
//     };

//     if (type === "Opening") {
//       const openingQty = reduceQty;
//       const stockValue = openingQty * price;

//       item.stock.openingQuantity = openingQty.toString();
//       item.stock.stockQuantity = openingQty.toString();
//       item.stock.availableForSale = openingQty.toString();
//       item.stock.stockValue = stockValue.toString();

//       newValues.quantity = openingQty;
//       newValues.pricePerUnit = price;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: openingQty,
//         pricePerUnit: price,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Opening",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Opening stock set successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: openingQty.toFixed(2),
//             pricePerUnit: price.toFixed(2),
//             value: stockValue.toFixed(2),
//           },
//         })
//       );
//     }

//     if (type === "Add") {
//       const currentQty = parseFloat(item.stock.stockQuantity || "0");
//       const currentValue = parseFloat(item.stock.stockValue || "0");

//       const newQty = currentQty + reduceQty;
//       const newValue = currentValue + reduceQty * price;
//       const avgPrice = newQty > 0 ? newValue / newQty : 0;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues.quantity = newQty;
//       newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Add",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Stock added successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: newQty.toFixed(2),
//             pricePerUnit: avgPrice.toFixed(2),
//             value: newValue.toFixed(2),
//           },
//         })
//       );
//     }

//     if (type === "Reduce") {
//       const currentQty = parseFloat(item.stock.stockQuantity || "0");
//       const currentValue = parseFloat(item.stock.stockValue || "0");

//       if (currentQty <= 0 || reduceQty > currentQty) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Insufficient stock to reduce", false));
//       }

//       const minStock = parseFloat(item.stock.minStockToMaintain || "0");
//       const newQty = currentQty - reduceQty;

//       if (newQty < minStock) {
//         return res.status(400).json(
//           errorResponse(
//             400,
//             "Insufficient stock to reduce below minimum threshold",
//             false
//           )
//         );
//       }

//       const avgPrice = currentQty > 0 ? currentValue / currentQty : 0;
//       const newValue = newQty * avgPrice;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues.quantity = newQty;
//       newValues.pricePerUnit = avgPrice;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: avgPrice,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Reduce",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Stock reduced successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: newQty.toFixed(2),
//             pricePerUnit: avgPrice.toFixed(2),
//             value: newValue.toFixed(2),
//           },
//         })
//       );
//     }

//     return res
//       .status(400)
//       .json(errorResponse(400, "Invalid operation type", false));
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const adjustStock = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing itemId in params.", false));
    }

    const { body } = req.body;
    if (!body) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing body in request.", false));
    }

    // Decrypt and parse the request body JSON
    const parsed = JSON.parse(decryptData(body));

    let { quantity, pricePerUnit, type, reason } = parsed;

    // Log raw inputs to debug
    console.log("Raw inputs:", { quantity, pricePerUnit, type, reason });

    // Convert quantity and pricePerUnit to numbers explicitly
    quantity = Number(quantity);
    pricePerUnit = Number(pricePerUnit);

    // Log parsed numeric values
    console.log("Parsed numbers:", { quantity, pricePerUnit });

    // Validate required fields
    if (!quantity || !pricePerUnit || !type) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields.", false));
    }

    // Validate type
    const allowedTypes = [
      "Add",
      "Reduce",
      "Adjust",
      "Opening",
      "sale",
      "purchasePrice",
    ];
    if (!allowedTypes.includes(type)) {
      return res
        .status(400)
        .json(errorResponse(400, `Invalid type: ${type}`, false));
    }

    // Find product
    const product = await Productitem.findById(itemId);
    if (!product) {
      return res
        .status(404)
        .json(errorResponse(404, "Product not found.", false));
    }

    const currentStock = parseFloat(product.stock.stockQuantity) || 0;
    const currentStockValue = parseFloat(product.stock.stockValue) || 0;

    let newStock, stockValue;

    if (type === "Add") {
      newStock = currentStock + quantity;
      stockValue = currentStockValue + quantity * pricePerUnit;
    } else if (type === "Reduce") {
      if (currentStock < quantity) {
        return res
          .status(400)
          .json(errorResponse(400, "Insufficient stock to reduce.", false));
      }
      newStock = currentStock - quantity;
      stockValue = currentStockValue - quantity * pricePerUnit;
    } else {
      newStock = currentStock;
      stockValue = currentStockValue;
    }

    newStock = Number(newStock.toFixed(2));
    stockValue = Number(stockValue.toFixed(2));
    pricePerUnit = Number(pricePerUnit.toFixed(2));

    // Update product stock
    await Productitem.findByIdAndUpdate(itemId, {
      "stock.stockQuantity": newStock.toString(),
      "stock.availableForSale": newStock.toString(),
      "stock.stockValue": stockValue.toString(),
    });

    // Create stock log
    await stocklogSchema.create({
      type: type,
      itemId: product._id,
      godownId: product.Godownid,
      referenceNo: `${type} Stock`,
      status: "Paid",
      quantity: quantity,
      pricePerUnit: pricePerUnit,
      date: new Date(),
      editHistory: [
        {
          operationType: type,
          oldValues: {
            quantity: currentStock,
            pricePerUnit: pricePerUnit,
          },
          newValues: {
            quantity: newStock,
            pricePerUnit: pricePerUnit,
          },
          reason,
        },
      ],
    });

    return res
      .status(200)
      .json(successResponse(200, `${type} stock successfully.`, "", true));
  } catch (error) {
    console.error("Error in adjustStock:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Internal server error.", false));
  }
};

// export const updateStockByType = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { itemId } = req.params;

//     const {
//       godownId,
//       quantity,
//       pricePerUnit,
//       type,
//       referenceNo,
//       status = "Paid",
//       createdBy,
//       date,
//       data = {},
//     } = parsed;

//     const item = await Productitem.findById(itemId);
//     if (!item) {
//       return res.status(404).json(errorResponse(404, "Product not found", false));
//     }

//     if (isNaN(quantity) || isNaN(pricePerUnit)) {
//       return res.status(400).json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
//     }

//     const reduceQty = parseFloat(quantity);
//     const price = parseFloat(pricePerUnit);

//     let oldValues = {
//       quantity: parseFloat(item.stock.stockQuantity || "0"),
//       pricePerUnit: parseFloat(item.stock.stockValue || "0") / parseFloat(item.stock.stockQuantity || "1"),
//     };

//     let newValues = {
//       quantity: 0,
//       pricePerUnit: 0,
//     };

//     // Opening stock
//     if (type === "Opening") {
//       const openingQty = reduceQty;
//       const stockValue = openingQty * price;

//       item.stock.openingQuantity = openingQty.toString();
//       item.stock.stockQuantity = openingQty.toString();
//       item.stock.availableForSale = openingQty.toString();
//       item.stock.stockValue = stockValue.toString();

//       newValues.quantity = openingQty;
//       newValues.pricePerUnit = price;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: openingQty,
//         pricePerUnit: price,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Opening",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Opening stock set successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: openingQty.toFixed(2),
//             pricePerUnit: price.toFixed(2),
//             value: stockValue.toFixed(2),
//           },
//         })
//       );
//     }

//     // Add stock
//     if (type === "Add") {
//       const currentQty = parseFloat(item.stock.stockQuantity || "0");
//       const currentValue = parseFloat(item.stock.stockValue || "0");

//       const newQty = currentQty + reduceQty;
//       const newValue = currentValue + reduceQty * price;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues.quantity = newQty;
//       newValues.pricePerUnit = price;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: price, // <-- Keep consistent
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Add",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Stock added successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: newQty.toFixed(2),
//             pricePerUnit: price.toFixed(2),
//             value: newValue.toFixed(2),
//           },
//         })
//       );
//     }

//     // Reduce stock
//      if (type === "Reduce") {
//       const currentQty = parseFloat(item.stock.stockQuantity || "0");
//       const currentValue = parseFloat(item.stock.stockValue || "0");

//       if (currentQty <= 0 || reduceQty > currentQty) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Insufficient stock to reduce", false));
//       }

//       const minStock = parseFloat(item.stock.minStockToMaintain || "0");
//       const newQty = currentQty - reduceQty;

//       if (newQty < minStock) {
//         return res.status(400).json(
//           errorResponse(
//             400,
//             "Insufficient stock to reduce below minimum threshold",
//             false
//           )
//         );
//       }

//       const reductionValue = reduceQty * price;
//       const newValue = currentValue - reductionValue;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues.quantity = newQty;

//       await item.save();

//       await logStockEvent({
//         itemId,
//         godownId,
//         type,
//         referenceNo,
//         status,
//         quantity: reduceQty,
//         pricePerUnit: price,
//         createdBy,
//         date,
//         data,
//       });

//       await logEditHistory({
//         itemId,
//         oldValues,
//         newValues,
//         operationType: "Reduce",
//         createdBy,
//       });

//       return res.status(200).json(
//         successResponse(200, "Stock reduced successfully", null, true, {
//           itemId: item._id,
//           stock: {
//             quantity: newQty.toFixed(2),
//             pricePerUnit: price.toFixed(2),
//             value: newValue.toFixed(2),
//           },
//         })
//       );
//     }

//     return res
//       .status(400)
//       .json(errorResponse(400, "Invalid operation type", false));
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };

// export const updateStockByType = async (req, res) => {
//   try {
//     const { body } = req.body;
//     const parsed = JSON.parse(decryptData(body));
//     const { itemId } = req.params;

//     const {
//       stockLogId, // Required for updates
//       godownId,
//       quantity,
//       pricePerUnit,
//       type,
//       referenceNo,
//       status = "Paid",
//       createdBy,
//       date,
//       data = {},
//     } = parsed;

//     const item = await Productitem.findById(itemId);
//     if (!item) {
//       return res
//         .status(404)
//         .json(errorResponse(404, "Product not found", false));
//     }

//     if (isNaN(quantity) || isNaN(pricePerUnit)) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
//     }

//     const reduceQty = parseFloat(quantity);
//     const price = parseFloat(pricePerUnit);

//     let currentQty = parseFloat(item.stock.stockQuantity || "0");
//     let currentValue = parseFloat(item.stock.stockValue || "0");
//     let avgPrice = currentQty > 0 ? currentValue / currentQty : 0;

//     const oldValues = { quantity: currentQty, pricePerUnit: avgPrice };
//     let newValues = { quantity: 0, pricePerUnit: 0 };

//     // Reverse previous stock log impact if editing existing stock log
//     let existingEvent = null;
//     if (stockLogId) {
//       existingEvent = await stocklogSchema.findById(stockLogId);
//       if (!existingEvent) {
//         return res
//           .status(404)
//           .json(errorResponse(404, "Stock log entry not found", false));
//       }

//       const oldQty = parseFloat(existingEvent.quantity);
//       const oldPrice = parseFloat(existingEvent.pricePerUnit);
//       const oldTotal = oldQty * oldPrice;

//       if (existingEvent.type === "Add") {
//         currentQty -= oldQty;
//         currentValue -= oldTotal;
//       } else if (existingEvent.type === "Reduce") {
//         currentQty += oldQty;
//         currentValue += oldTotal;
//       } else if (existingEvent.type === "Opening") {
//         currentQty = 0;
//         currentValue = 0;
//       }

//       item.stock.stockQuantity = currentQty.toString();
//       item.stock.availableForSale = currentQty.toString();
//       item.stock.stockValue = currentValue.toString();
//       await item.save();
//     }

//     // Process based on type
//     if (type === "Opening") {
//       const openingQty = reduceQty;
//       const stockValue = openingQty * price;

//       item.stock.openingQuantity = openingQty.toString();
//       item.stock.stockQuantity = openingQty.toString();
//       item.stock.availableForSale = openingQty.toString();
//       item.stock.stockValue = stockValue.toString();

//       newValues = { quantity: openingQty, pricePerUnit: price };
//       await item.save();

//       if (stockLogId) {
//         existingEvent.set({
//           godownId,
//           quantity: openingQty,
//           pricePerUnit: price,
//           type,
//           referenceNo,
//           status,
//           createdBy,
//           date,
//           data,
//         });
//         await existingEvent.save();
//       }
//     } else if (type === "Add") {
//       const newQty = currentQty + reduceQty;
//       const newValue = currentValue + reduceQty * price;
//       const newAvgPrice = newQty > 0 ? newValue / newQty : 0;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues = { quantity: newQty, pricePerUnit: newAvgPrice };
//       await item.save();

//       if (stockLogId) {
//         existingEvent.set({
//           godownId,
//           quantity: reduceQty,
//           pricePerUnit: price,
//           type,
//           referenceNo,
//           status,
//           createdBy,
//           date,
//           data,
//         });
//         await existingEvent.save();
//       }
//     } else if (type === "Reduce") {
//       if (currentQty <= 0 || reduceQty > currentQty) {
//         return res
//           .status(400)
//           .json(errorResponse(400, "Insufficient stock to reduce", false));
//       }

//       const minStock = parseFloat(item.stock.minStockToMaintain || "0");
//       const newQty = currentQty - reduceQty;

//       if (newQty < minStock) {
//         return res
//           .status(400)
//           .json(
//             errorResponse(
//               400,
//               "Insufficient stock to reduce below minimum threshold",
//               false
//             )
//           );
//       }

//       const avgPrice = currentQty > 0 ? currentValue / currentQty : 0;
//       const newValue = newQty * avgPrice;

//       item.stock.stockQuantity = newQty.toString();
//       item.stock.availableForSale = newQty.toString();
//       item.stock.stockValue = newValue.toString();

//       newValues = { quantity: newQty, pricePerUnit: avgPrice };
//       await item.save();

//       if (stockLogId) {
//         existingEvent.set({
//           godownId,
//           quantity: reduceQty,
//           pricePerUnit: avgPrice,
//           type,
//           referenceNo,
//           status,
//           createdBy,
//           date,
//           data,
//         });
//         await existingEvent.save();
//       }
//     } else {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Invalid operation type", false));
//     }

//     await logEditHistory({
//       itemId,
//       oldValues,
//       newValues,
//       operationType: type,
//       createdBy,
//     });

//     return res.status(200).json(
//       successResponse(
//         200,
//         `Stock ${stockLogId ? "updated" : "added"} successfully`,
//         null,
//         true,
//         {
//           itemId: item._id,
//           stock: {
//             quantity: newValues.quantity.toFixed(2),
//             pricePerUnit: newValues.pricePerUnit.toFixed(2),
//             value: (newValues.quantity * newValues.pricePerUnit).toFixed(2),
//           },
//         }
//       )
//     );
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };


export const updateStockByType = async (req, res) => {
  try {
    // Decrypt and parse the request body
    const { body } = req.body;
    const parsed = JSON.parse(decryptData(body));
    const { itemId } = req.params;

    // Destructure all expected fields from parsed data
    const {
      stockLogId, // If updating existing stock log
      godownId,
      quantity,
      pricePerUnit,
      type,
      referenceNo,
      status = "Paid",
      createdBy,
      date,
      data = {},
    } = parsed;

    // Fetch the product item by ID
    const item = await Productitem.findById(itemId);
    if (!item) {
      return res.status(404).json(errorResponse(404, "Product not found", false));
    }

    // Validate quantity and pricePerUnit
    if (isNaN(quantity) || isNaN(pricePerUnit)) {
      return res.status(400).json(errorResponse(400, "Invalid quantity or pricePerUnit", false));
    }

    // Parse numeric values
    const reduceQty = parseFloat(quantity);
    const price = parseFloat(pricePerUnit);

    // Current stock quantity and value
    let currentQty = parseFloat(item.stock.stockQuantity || "0");
    let currentValue = parseFloat(item.stock.stockValue || "0");

    // Calculate average price per unit
    let avgPrice = currentQty > 0 ? currentValue / currentQty : 0;

    const oldValues = { quantity: currentQty, pricePerUnit: avgPrice };
    let newValues = { quantity: 0, pricePerUnit: 0 };

    // If updating an existing stock log, reverse its effect on stock
    let existingEvent = null;
    if (stockLogId) {
      existingEvent = await stocklogSchema.findById(stockLogId);
      if (!existingEvent) {
        return res.status(404).json(errorResponse(404, "Stock log entry not found", false));
      }

      const oldQty = parseFloat(existingEvent.quantity);
      const oldPrice = parseFloat(existingEvent.pricePerUnit);
      const oldTotal = oldQty * oldPrice;

      if (existingEvent.type === "Add") {
        currentQty -= oldQty;
        currentValue -= oldTotal;
      } else if (existingEvent.type === "Reduce") {
        currentQty += oldQty;
        currentValue += oldTotal;
      } else if (existingEvent.type === "Opening") {
        currentQty = 0;
        currentValue = 0;
      }

      item.stock.stockQuantity = currentQty.toString();
      item.stock.availableForSale = currentQty.toString();
      item.stock.stockValue = currentValue.toString();
      await item.save();
    }

    // Process the update based on the type of stock operation
    if (type === "Opening") {
      const openingQty = reduceQty;
      const stockValue = openingQty * price;

      item.stock.openingQuantity = openingQty.toString();
      item.stock.stockQuantity = openingQty.toString();
      item.stock.availableForSale = openingQty.toString();
      item.stock.stockValue = stockValue.toString();

      newValues = { quantity: openingQty, pricePerUnit: price };
      await item.save();

      if (stockLogId) {
        existingEvent.set({
          godownId,
          quantity: openingQty,
          pricePerUnit: price,
          type,
          referenceNo,
          status,
          createdBy,
          date,
          data,
        });
        await existingEvent.save();
      }
    } else if (type === "Add") {
      const newQty = currentQty + reduceQty;
      const newValue = currentValue + reduceQty * price;
      const newAvgPrice = newQty > 0 ? newValue / newQty : 0;

      item.stock.stockQuantity = newQty.toString();
      item.stock.availableForSale = newQty.toString();
      item.stock.stockValue = newValue.toString();

      newValues = { quantity: newQty, pricePerUnit: newAvgPrice };
      await item.save();

      if (stockLogId) {
        existingEvent.set({
          godownId,
          quantity: reduceQty,
          pricePerUnit: price,
          type,
          referenceNo,
          status,
          createdBy,
          date,
          data,
        });
        await existingEvent.save();
      }
    } else if (type === "Reduce") {
      if (currentQty <= 0 || reduceQty > currentQty) {
        return res.status(400).json(errorResponse(400, "Insufficient stock to reduce", false));
      }

      const minStock = parseFloat(item.stock.minStockToMaintain || "0");
      const newQty = currentQty - reduceQty;

      if (newQty < minStock) {
        return res.status(400).json(
          errorResponse(400, "Insufficient stock to reduce below minimum threshold", false)
        );
      }

      const avgPrice = currentQty > 0 ? currentValue / currentQty : 0;
      const newValue = newQty * avgPrice;

      item.stock.stockQuantity = newQty.toString();
      item.stock.availableForSale = newQty.toString();
      item.stock.stockValue = newValue.toString();

      newValues = { quantity: newQty, pricePerUnit: avgPrice };
      await item.save();

      if (stockLogId) {
        existingEvent.set({
          godownId,
          quantity: reduceQty,
          pricePerUnit: avgPrice,
          type,
          referenceNo,
          status,
          createdBy,
          date,
          data,
        });
        await existingEvent.save();
      }
    } else {
      return res.status(400).json(errorResponse(400, "Invalid operation type", false));
    }

    // Log the stock edit history
    await logEditHistory({
      itemId,
      oldValues,
      newValues,
      operationType: type,
      createdBy,
    });

    // Respond success with updated stock details
    return res.status(200).json(
      successResponse(
        200,
        `Stock ${stockLogId ? "updated" : "added"} successfully`,
        null,
        true,
        {
          itemId: item._id,
          stock: {
            quantity: newValues.quantity.toFixed(2),
            pricePerUnit: newValues.pricePerUnit.toFixed(2),
            value: (newValues.quantity * newValues.pricePerUnit).toFixed(2),
          },
        }
      )
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};
