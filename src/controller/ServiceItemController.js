import CategoryItem from "../models/CatagoryItem.js";
import PrimaryUnit from "../models/PrimaryUnit.js";
import SecondaryUnit from "../models/SecondaryUnit.js";
import ServiceItem from "../models/ServiceItem.js"
import Gst from "../models/Gst.js";
import { encryptData, decryptData } from "../lib/encrypt.js";
import { successResponse, errorResponse } from "../lib/reply.js";

export const createService = async (req, res) => {
  try {
    const {
      serviceName,
      serviceHSN,
      selectUnit,
      itemImage,
      category,
      serviceCode,
      pricing,
      onlineStore
    } = req.decryptedBody;

    if (
      (!pricing?.salePrice?.withTax && !pricing?.salePrice?.withoutTax) ||
      (pricing?.salePrice?.withTax && pricing?.salePrice?.withoutTax)
    ) {
      return res.status(400).json(errorResponse(400, "Provide either 'withTax' or 'withoutTax' for salePrice, not both.", false));
    }

    const [
      categoryDoc,
      baseUnitDoc,
      secondaryUnitDoc,
      taxRateDoc
    ] = await Promise.all([
      CategoryItem.findById(category),
      selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
      selectUnit?.secondaryUnit ? SecondaryUnit.findById(selectUnit.secondaryUnit) : null,
      pricing?.taxRate ? Gst.findById(pricing.taxRate) : null
    ]);

    if (!categoryDoc) {
      return res.status(400).json(errorResponse(400, "Invalid Category ID.", false));
    }
    if (selectUnit?.baseUnit && !baseUnitDoc) {
      return res.status(400).json(errorResponse(400, "Invalid Base Unit ID.", false));
    }
    if (selectUnit?.secondaryUnit && !secondaryUnitDoc) {
      return res.status(400).json(errorResponse(400, "Invalid Secondary Unit ID.", false));
    }
    if (pricing?.taxRate && !taxRateDoc) {
      return res.status(400).json(errorResponse(400, "Invalid GST ID.", false));
    }

    const safeEncrypt = (value) =>
      value !== undefined && value !== null ? encryptData(value)?.encryptedData : undefined;

    const serviceData = {
      serviceName: safeEncrypt(serviceName),
      serviceHSN: safeEncrypt(serviceHSN),
      selectUnit: {
        baseUnit: baseUnitDoc?._id,
        secondaryUnit: secondaryUnitDoc?._id,
        conversionRate: safeEncrypt(selectUnit?.conversionRate),
      },
      itemImage: itemImage,
      category: categoryDoc._id,
      serviceCode: serviceCode, // Plain string, not encrypted, as per schema
      pricing: {
        salePrice: {
          withTax: safeEncrypt(pricing?.salePrice?.withTax),
          withoutTax: safeEncrypt(pricing?.salePrice?.withoutTax),
          discount: {
            type: pricing?.salePrice?.discount?.type,
            value: safeEncrypt(pricing?.salePrice?.discount?.value),
          },
        },
        taxRate: taxRateDoc?._id,
      },
      onlineStore: {
        onlineStorePrice: safeEncrypt(onlineStore?.onlineStorePrice),
        description: safeEncrypt(onlineStore?.description),
      },
    };

    const newService = new ServiceItem(serviceData);
    await newService.save();

    return res.status(201).json(successResponse(201, "", "Service created successfully", "", true));
  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse(500, "Internal server error.", false));
  }
};

  
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceName,
      serviceHSN,
      selectUnit,
      itemImage,
      category,
      serviceCode,
      pricing,
      onlineStore
    } = req.decryptedBody;

    if (!id) {
      return res.status(400).json(errorResponse(400, "ID is required.", false));
    }

    const service = await ServiceItem.findById(id);
    if (!service) {
      return res.status(404).json(errorResponse(404, "Service not found.", false));
    }

    // Fetch related documents (only if provided)
    const [categoryDoc, baseUnitDoc, secondaryUnitDoc, taxRateDoc] = await Promise.all([
      category ? CategoryItem.findById(category) : null,
      selectUnit?.baseUnit ? PrimaryUnit.findById(selectUnit.baseUnit) : null,
      selectUnit?.secondaryUnit ? SecondaryUnit.findById(selectUnit.secondaryUnit) : null,
      pricing?.taxRate ? Gst.findById(pricing.taxRate) : null
    ]);

    // Validate existence of related documents
    if (selectUnit?.baseUnit && !baseUnitDoc) {
      return res.status(400).json(errorResponse(400, "Invalid Base Unit ID.", false));
    }
    if (selectUnit?.secondaryUnit && !secondaryUnitDoc) {
      return res.status(400).json(errorResponse(400, "Invalid Secondary Unit ID.", false));
    }
    if (pricing?.taxRate && !taxRateDoc) {
      return res.status(400).json(errorResponse(400, "Invalid GST ID.", false));
    }

    const safeEncrypt = (value) => value !== undefined && value !== null ? encryptData(value)?.encryptedData : undefined;

    // Update encrypted fields
    if (serviceName) service.serviceName = safeEncrypt(serviceName);
    if (serviceHSN) service.serviceHSN = safeEncrypt(serviceHSN);
    if (itemImage) service.itemImage = safeEncrypt(itemImage);
    if (categoryDoc?._id) service.category = categoryDoc._id;
    if (serviceCode) service.serviceCode = safeEncrypt(serviceCode);

    if (selectUnit) {
      service.selectUnit = {
        baseUnit: baseUnitDoc?._id,
        secondaryUnit: secondaryUnitDoc?._id,
        conversionRate: safeEncrypt(selectUnit?.conversionRate ? JSON.stringify(selectUnit.conversionRate) : undefined)
      };
    }

    if (pricing) {
      const { salePrice, taxRate } = pricing;
      service.pricing = {
        salePrice: {
          withTax: salePrice?.withTax ? safeEncrypt(JSON.stringify(salePrice.withTax)) : undefined,
          withoutTax: salePrice?.withoutTax ? safeEncrypt(JSON.stringify(salePrice.withoutTax)) : undefined,
          discount: {
            type: salePrice?.discount?.type,
            value: salePrice?.discount?.value ? safeEncrypt(JSON.stringify(salePrice.discount.value)) : undefined
          }
        },
        taxRate: taxRateDoc?._id
      };
    }

    if (onlineStore) {
      service.onlineStore = {
        onlineStorePrice: onlineStore?.onlineStorePrice ? safeEncrypt(JSON.stringify(onlineStore.onlineStorePrice)) : undefined,
        description: onlineStore?.description ? safeEncrypt(onlineStore.description) : undefined
      };
    }

    await service.save();
    return res.status(200).json(successResponse(200, "", "Service updated successfully", "", true));

  } catch (error) {
    console.error(error);
    return res.status(500).json(errorResponse(500, "Internal server error.", false));
  }
};



  export const getAllServices = async (req, res) => {
    try {
      // Fetch all services from the database
      const services = await ServiceItem.find()
        .populate('category')
        .populate('serviceCode')
        .populate('selectUnit.baseUnit')
        .populate('selectUnit.secondaryUnit')
        .populate('pricing.taxRate')
        .exec();
  
      if (!services || services.length === 0) {
        return res.status(404).json(errorResponse(404, "No services found.", false));
      }
  
      // Decrypt service data
      const decryptedServices = services.map(service => ({
        // ...service.toObject(),
        _id: service._id,
        serviceName: service.serviceName ? decryptData(service.serviceName) : null, 
        serviceHSN: service.serviceHSN ? decryptData(service.serviceHSN) : null,
        itemImage: service.itemImage ? decryptData(service.itemImage) : null,
        selectUnit: {
          baseUnit: service.selectUnit.baseUnit ? service.selectUnit.baseUnit.name : null,
          secondaryUnit: service.selectUnit.secondaryUnit ? service.selectUnit.secondaryUnit.name : null,
          conversionRate: service.selectUnit.conversionRate ? decryptData(service.selectUnit.conversionRate) : null,
        },
        pricing: {
          salePrice: {
            withTax: service.pricing.salePrice?.withTax ? decryptData(service.pricing.salePrice.withTax) : null,
            withoutTax: service.pricing.salePrice?.withoutTax ? decryptData(service.pricing.salePrice.withoutTax) : null,
            discount: {
              type: service.pricing.salePrice?.discount?.type,
              value: service.pricing.salePrice?.discount?.value ? decryptData(service.pricing.salePrice.discount.value) : null,
            },
          },
          taxRate: service.pricing.taxRate ? service.pricing.taxRate.name : null,
        },
        onlineStore: {
          onlineStorePrice: service.onlineStore.onlineStorePrice ? decryptData(service.onlineStore.onlineStorePrice) : null,
          description: service.onlineStore.description ? decryptData(service.onlineStore.description) : null,
        }
      }));
  
      return res.status(200).json(successResponse(200, decryptedServices, "All services fetched successfully","", true));
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorResponse(500, "Internal server error.", false));
    }
  };
  



  export const deleteService = async (req, res) => {
    try {
      const { id } = req.params;  
  
      if (!id) {
        return res.status(400).json(errorResponse(400, "ID is required.", false));
      }
  
      const service = await ServiceItem.findById(id);
  
      if (!service) {
        return res.status(404).json(errorResponse(404, "Service not found.", false));
      }
  
      await service.remove();
  
      return res.status(200).json(successResponse(200, "", "Service deleted successfully", "", true));
    } catch (error) {
      console.error(error);
      return res.status(500).json(errorResponse(500, "Internal server error.", false));
    }
  };
  
  