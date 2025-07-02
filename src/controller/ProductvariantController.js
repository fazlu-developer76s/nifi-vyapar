import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import ProductVariant from "../models/productvariant.js";

export const CreateProductVariant = async (req, res) => {
  try {
    const user = req.user;
    const { productId, sku, barcode, quantity, saleprice, purchaseprice,status } = req.decryptedBody;
    console.log(req.decryptedBody,"gg")

    const encryptedSku = encryptData(sku)?.encryptedData;
    const encryptedBarcode = encryptData(barcode)?.encryptedData;
    const encryptedQuantity = encryptData(quantity)?.encryptedData;
    const encryptedSalePrice = encryptData(saleprice)?.encryptedData;
    const encryptedPurchasePrice = encryptData(purchaseprice)?.encryptedData;

    // 🔁 Check for duplicate using encrypted barcode
    const existing = await ProductVariant.findOne({
      barcode: encryptedBarcode,
      userId: user,
    });

    if (existing) {
      return res
        .status(400)
        .json(errorResponse(400, "Barcode already exists", false));
    }

    // 🆕 Create and save new variant
    const newVariant = new ProductVariant({
      productId,
      sku: encryptedSku,
      barcode: encryptedBarcode,
      quantity: encryptedQuantity,
      saleprice: encryptedSalePrice,
      purchaseprice: encryptedPurchasePrice,
      userId: user,
      status: status || "active",
    });

    await newVariant.save();

    return res.status(201).json(
      successResponse(
        201,
        "Product variant created successfully",
        null,
        true,
        newVariant
      )
    );
  } catch (error) {
    console.error("Error in CreateProductVariant:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};


export const UpdateProductVariant = async (req, res) => {
  try {
    const user=req.user
    const { id } = req.params;
    // const { body } = req.body;
    // const decrypted = JSON.parse(decryptData(body));
    const { sku, barcode, quantity, saleprice, purchaseprice,status } = req.decryptedBody;

     if (barcode) {
      const existingVariants = await ProductVariant.find({ _id: { $ne: id },  userId: user }); 

      const isDuplicate = existingVariants.some((variant) => {
        const existingBarcode = decryptData(variant.barcode);
        return existingBarcode === barcode;
      });

      if (isDuplicate) {
        return res.status(400).json(errorResponse(400, "Barcode already exists", false));
      }
    }

     const updateFields = {};
    if (sku !== undefined) updateFields.sku = sku !== null ? encryptData(sku)?.encryptedData : null;
    if (barcode !== undefined) updateFields.barcode = barcode !== null ? encryptData(barcode)?.encryptedData : null;
    if (quantity !== undefined) updateFields.quantity = quantity !== null ? encryptData(quantity)?.encryptedData : null;
    if (saleprice !== undefined) updateFields.saleprice = saleprice !== null ? encryptData(saleprice)?.encryptedData : null;
    if (purchaseprice !== undefined) updateFields.purchaseprice = purchaseprice !== null ? encryptData(purchaseprice)?.encryptedData : null;
    
    if (status !== undefined) {
      updateFields.status = status || "active";
    }

    // Only update if it belongs to the current user
    const updated = await ProductVariant.findOneAndUpdate(
      { _id: id, userId: user},
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json(errorResponse(404, "Variant not found", false));
    }

    res.status(200).json(successResponse(200, "Product variant updated successfully",null, true, updated));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};


export const GetAllProductVariants = async (req, res) => {
  try {
    const user=req.user
    const variants = await ProductVariant.find({userId:user})
      .populate({
        path: "productId",
        populate: [
          { path: "category" },
          { path: "pricing.taxRate" },
          { path: "Godownid" },
          { path: "selectUnit.baseUnit" },
          { path: "selectUnit.secondaryUnit" },
        ],
      });

    const decryptedVariants = variants.map((v) => {
      const p = v.productId;

      const decryptedProduct = p
        ? {
            _id: p._id,
            itemName: p.itemName ? decryptData(p.itemName) : null,
            itemHSN: p.itemHSN ? decryptData(p.itemHSN) : null,
            itemImage: p.itemImage?.map((img) => decryptData(img)) || [],
            itemCode: p.itemCode,
            category: p.category
              ? {
                  _id: p.category._id,
                  name: p.category.name ? decryptData(p.category.name) : null,
                  status: p.category.status,
                }
              : null,
            Godownid: p.Godownid
              ? {
                  _id: p.Godownid._id,
                  GodownName: decryptData(p.Godownid.GodownName),
                  emailId: decryptData(p.Godownid.emailId),
                  gstIn: decryptData(p.Godownid.gstIn),
                  PhnNo: decryptData(p.Godownid.PhnNo),
                  GodownAddress: decryptData(p.Godownid.GodownAddress),
                  GodownPincode: decryptData(p.Godownid.GodownPincode),
                }
              : null,
            selectUnit: {
              baseUnit: p.selectUnit?.baseUnit
                ? {
                    _id: p.selectUnit.baseUnit._id,
                    name: decryptData(p.selectUnit.baseUnit.name),
                  }
                : null,
              secondaryUnit: p.selectUnit?.secondaryUnit
                ? {
                    _id: p.selectUnit.secondaryUnit._id,
                    name: decryptData(p.selectUnit.secondaryUnit.name),
                  }
                : null,
              conversionRate: p.selectUnit?.conversionRate
                ? JSON.parse(decryptData(p.selectUnit.conversionRate))
                : null,
            },
            pricing: {
              salePrice: {
                withTax: decryptData(p.pricing?.salePrice?.withTax),
                withoutTax: decryptData(p.pricing?.salePrice?.withoutTax),
                discount: {
                  type: p.pricing?.salePrice?.discount?.type,
                  value: decryptData(p.pricing?.salePrice?.discount?.value),
                },
              },
              purchasePrice: {
                withTax: decryptData(p.pricing?.purchasePrice?.withTax),
                withoutTax: decryptData(p.pricing?.purchasePrice?.withoutTax),
              },
              taxRate: p.pricing?.taxRate
                ? {
                    _id: p.pricing.taxRate._id,
                    label: decryptData(p.pricing.taxRate.label),
                    rate: decryptData(p.pricing.taxRate.rate),
                    status: p.pricing.taxRate.status,
                  }
                : null,
            },
            stock: {
              openingQuantity: decryptData(p.stock?.openingQuantity),
              atPrice: decryptData(p.stock?.atPrice),
              asOfDate: p.stock?.asOfDate,
              minStockToMaintain: decryptData(p.stock?.minStockToMaintain),
              location: decryptData(p.stock?.location),
              stockQuantity: p.stock?.stockQuantity,
              reservedQuantity: p.stock?.reservedQuantity,
              availableForSale: p.stock?.availableForSale,
              stockValue: p.stock?.stockValue,
            },
            onlineStore: {
              onlineStorePrice: decryptData(p.onlineStore?.onlineStorePrice),
              description: decryptData(p.onlineStore?.description),
            },
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          }
        : null;

      return {
        _id: v._id,
        sku: decryptData(v.sku),
        barcode: decryptData(v.barcode),
        quantity: decryptData(v.quantity),
        saleprice: decryptData(v.saleprice),
        purchaseprice: decryptData(v.purchaseprice),
        status: v.status,
        productId: decryptedProduct,
        createdAt: v.createdAt,
        updatedAt: v.updatedAt,
      };
    });

    res.status(200).json(
      successResponse(
        200,
        "Product variants fetched successfully",
        null,
        true,
        decryptedVariants
      )
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};



export const DeleteProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductVariant.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json(errorResponse(404, "Variant not found", false));
    }

    res.status(200).json(successResponse(200, "Product variant deleted successfully", true));
  } catch (error) {
    console.error(error);
    res.status(500).json(errorResponse(500, "Something went wrong", false));
  }
};

