import { Company } from "../models/company.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const createCompany = async (req, res) => {
  console.log(req.body);
  try {
    const {
      CompanyName,
      CompanyMobile,
      Companyemail,
      address,
      gstIn,
      status,
    } = req.body;

    const existingCompany = await Company.findOne({
      CompanyName,
      userID: req.user.id,
    });

    if (existingCompany) {
      errorResponse(res, "Company already exists", 400);
      return;
    }

    const newCompany = await Company.create({
      CompanyName,
      CompanyMobile,
      Companyemail,
      gstIn,
      address,
      status: status || "active",
      userID: req.user.id,
    });

    successResponse(res, "Company created successfully", newCompany, 201);
  } catch (err) {
    console.log(err, "error in company controller");
    errorResponse(res, "Error creating company", 500, err.message);
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ userID: req.user.id }).select(
      "-__v"
    );

    const decryptedCompanies = companies?.map((company) => ({
      _id: company._id,
      CompanyName: (company.CompanyName),
      CompanyMobile: (company.CompanyMobile),
      Companyemail: (company.Companyemail),
      address: (company.address),
      gstIn: company.gstIn ? (company.gstIn) : "",
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    successResponse(
      res,
      "Companies fetched successfully",
      decryptedCompanies,
      200
    );
  } catch (error) {
    errorResponse(res, "Error fetching companies", 500, error.message);
  }
};


export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const companyDoc = await Company.findById(id);
    if (!companyDoc) {
      errorResponse(res, "Company not found", 404);
      return;
    }

    const checkCompany = await Company.findOne({
      CompanyName: req.body.CompanyName,
      userID: req.user.id,
      _id: { $ne: id },
    });

    if (checkCompany) {
      errorResponse(res, "Company already exists", 400);
      return;
    }

    if (req.body.CompanyName) {
      companyDoc.CompanyName = req.body.CompanyName;
    }
    if (req.body.CompanyMobile) {
      companyDoc.CompanyMobile = req.body.CompanyMobile;
    }
    if (req.body.Companyemail) {
      companyDoc.Companyemail = req.body.Companyemail;
    }
    if (req.body.address) {
      companyDoc.address = req.body.address;
    }
    if (req.body.gstIn) {
      companyDoc.gstIn = req.body.gstIn;
    }
    if (typeof req.body.status !== "undefined") {
      companyDoc.status = req.body.status;
    }

    await companyDoc.save();
    successResponse(res, "Company updated successfully", companyDoc, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error updating company", 500, err.message);
    return;
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) {
      errorResponse(res, "Company not found", 404);
      return;
    }
    successResponse(res, "Company deleted successfully", deleted, 200);
    return;
  } catch (err) {
    errorResponse(res, "Error deleting company", 500, err.message);
    return;
  }
};
