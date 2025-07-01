import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { CMS } from "../models/cms.js";

export const updateCMSSection = async (req, res) => {
  try {
    // const { body } = req.body;

    // if (!body) {
    //   return res
    //     .status(400)
    //     .json(errorResponse(400, "Encrypted request body is required", false));
    // }

    // const decrypted = decryptData(body);
    // const parsed = JSON.parse(decrypted);

    const {
      page,
      category,
      type,
      imageLocation,
      image,
      logo,
      h1,
      description,
      h1Color,
      descriptionColor,
      h1FontFamily,
      descriptionFontFamily,
      buttonColor,
      buttonText,
      buttonUrl,
      faqs,
      footer,
      testimonials,
      status,
    } = req.decryptedBody;

    if (!category || !page) {
      return res
        .status(400)
        .json(errorResponse(400, "Category and page are required", false));
    }

    let cmsDoc = await CMS.findOne({ page });

    if (!cmsDoc) {
      cmsDoc = new CMS({
        userId: req.user?._id,
        page,
        sections: [],
      });
    }

    const encryptedData = {
      h1: encryptData(JSON.stringify(h1))?.encryptedData,
      description: encryptData(JSON.stringify(description))?.encryptedData,
      buttonText: encryptData(JSON.stringify(buttonText))?.encryptedData,
      buttonUrl: encryptData(JSON.stringify(buttonUrl))?.encryptedData,
      faqs: faqs ? encryptData(JSON.stringify(faqs))?.encryptedData : undefined,
      footer: footer
        ? encryptData(JSON.stringify(footer))?.encryptedData
        : undefined,
      testimonials: testimonials
        ? encryptData(JSON.stringify(testimonials))?.encryptedData
        : undefined,
    };

    const sectionData = {
      category,
      type,
      imageLocation,
      image,
      logo,
      h1Color,
      descriptionColor,
      h1FontFamily,
      descriptionFontFamily,
      buttonColor,
      status,
    };

    if (h1) sectionData.h1 = encryptedData.h1;
    if (description) sectionData.description = encryptedData.description;
    if (buttonText) sectionData.buttonText = encryptedData.buttonText;
    if (buttonUrl) sectionData.buttonUrl = encryptedData.buttonUrl;
    if (faqs) sectionData.faqs = encryptedData.faqs;
    if (footer) sectionData.footer = encryptedData.footer;
    if (testimonials) sectionData.testimonials = encryptedData.testimonials;

    const index = cmsDoc.sections.findIndex((sec) => sec.category === category);

    if (index !== -1) {
      cmsDoc.sections[index] = {
        ...cmsDoc.sections[index]._doc,
        ...sectionData,
      };
    } else {
      cmsDoc.sections.push(sectionData);
    }

    await cmsDoc.save();

    return res
      .status(200)
      .json(
        successResponse(
          200,
          `${category} section updated successfully`,
          "",
          true,
          cmsDoc
        )
      );
  } catch (err) {
    console.error("Error updating CMS:", err);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong", false, err.message));
  }
};

export const getAllCMS = async (req, res) => {
  try {
    const cmsDocs = await CMS.find().sort({ createdAt: -1 });

    const decryptedDocs = cmsDocs.map((doc) => {
      const newDoc = doc.toObject();

      newDoc.sections = newDoc.sections.map((section) => {
        const decryptedSection = { ...section };

        if (section.h1)
          decryptedSection.h1 = JSON.parse(decryptData(section.h1));
        if (section.description)
          decryptedSection.description = JSON.parse(
            decryptData(section.description)
          );
        if (section.buttonText)
          decryptedSection.buttonText = JSON.parse(
            decryptData(section.buttonText)
          );
        if (section.buttonUrl)
          decryptedSection.buttonUrl = JSON.parse(
            decryptData(section.buttonUrl)
          );
        if (section.faqs)
          decryptedSection.faqs = JSON.parse(decryptData(section.faqs));
        if (section.footer)
          decryptedSection.footer = JSON.parse(decryptData(section.footer));
        if (section.testimonials)
          decryptedSection.testimonials = JSON.parse(
            decryptData(section.testimonials)
          );

        return decryptedSection;
      });

      return newDoc;
    });

    return res
      .status(200)
      .json(successResponse(200, "All CMS fetched", "", true, decryptedDocs));
  } catch (err) {
    console.error("Error fetching all CMS:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, err.message));
  }
};

export const getCMSById = async (req, res) => {
  try {
    const { id } = req.params;
    const cms = await CMS.findById(id);

    if (!cms) {
      return res.status(404).json(errorResponse(404, "CMS not found", false));
    }

    const cmsObject = cms.toObject();

    cmsObject.sections = cmsObject.sections.map((section) => {
      const decryptedSection = { ...section };

      if (section.h1) decryptedSection.h1 = JSON.parse(decryptData(section.h1));
      if (section.description)
        decryptedSection.description = JSON.parse(
          decryptData(section.description)
        );
      if (section.buttonText)
        decryptedSection.buttonText = JSON.parse(
          decryptData(section.buttonText)
        );
      if (section.buttonUrl)
        decryptedSection.buttonUrl = JSON.parse(decryptData(section.buttonUrl));
      if (section.faqs)
        decryptedSection.faqs = JSON.parse(decryptData(section.faqs));
      if (section.footer)
        decryptedSection.footer = JSON.parse(decryptData(section.footer));
      if (section.testimonials)
        decryptedSection.testimonials = JSON.parse(
          decryptData(section.testimonials)
        );

      return decryptedSection;
    });

    return res
      .status(200)
      .json(successResponse(200, "CMS fetched", "", true, cmsObject));
  } catch (err) {
    console.error("Error fetching CMS by ID:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, err.message));
  }
};

export const deleteCMSSection = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json(errorResponse(400, "Category is required", false));
    }

    const cmsDoc = await CMS.findById(id);
    if (!cmsDoc) {
      return res.status(404).json(errorResponse(404, "CMS not found", false));
    }

    const sectionIndex = cmsDoc.sections.findIndex(
      (sec) => sec.category === category
    );
    if (sectionIndex === -1) {
      return res
        .status(404)
        .json(errorResponse(404, "Section not found", false));
    }

    cmsDoc.sections.splice(sectionIndex, 1);
    await cmsDoc.save();

    return res
      .status(200)
      .json(
        successResponse(200, "Section deleted successfully", "", true, cmsDoc)
      );
  } catch (err) {
    console.error("Error deleting CMS section:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Server Error", false, err.message));
  }
};
