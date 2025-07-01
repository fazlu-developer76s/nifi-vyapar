import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { AdmCompany } from "../models/userAdminCompany.js";
import User from "../models/User.js";


export const createAdmCompany = async (req, res) => {
  try {
    const user=req.user;
    console.log(user)
   
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);
    const {
      CompanyName,
      CompanyMobile,
      Companyemail,
     
      status 
    } = req.decryptedBody;

 
    if (!CompanyName  || !CompanyMobile || !Companyemail ) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }

 
    const encryptedName = encryptData(CompanyName)?.encryptedData;
    const encryptedMobile = encryptData(CompanyMobile)?.encryptedData;
    const encryptedEmail = encryptData(Companyemail)?.encryptedData;
   const encryptedStatus = encryptData(String(status || "true"))?.encryptedData;

  
   const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json(errorResponse(404, "User not found", false));
    }

   
    const existingCompany = await  AdmCompany.findOne({ Companyemail: encryptedEmail });
    if (existingCompany) {
      return res
        .status(400)
        .json(errorResponse(400, "Company email already exists", false));
    }

 
    const newCompany = new AdmCompany({
      CompanyName: encryptedName,
      CompanyMobile: encryptedMobile,
      Companyemail: encryptedEmail,
      status: encryptedStatus,
      userId: user,
    });

    await newCompany.save();

    existUser.companyDetails = {
      company_Id: newCompany._id,
    };
    await existUser.save();

    return res
      .status(201)
      .json(successResponse(201, "Company created successfully", "", true, ""));
  } catch (error) {
    console.error("Create Company Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

export const updateAdmCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { CompanyName, CompanyMobile, Companyemail, status } = req.decryptedBody;

    const existingCompany = await AdmCompany.findById(id);
    if (!existingCompany) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found", false));
    }

    if (CompanyName) {
      const result = encryptData(CompanyName);
      if (result?.encryptedData) {
        existingCompany.CompanyName = result.encryptedData;
      }
    }

    if (CompanyMobile) {
      const result = encryptData(CompanyMobile);
      if (result?.encryptedData) {
        existingCompany.CompanyMobile = result.encryptedData;
      }
    }

    if (Companyemail) {
      const result = encryptData(Companyemail);
      if (result?.encryptedData) {
        existingCompany.Companyemail = result.encryptedData;
      }
    }

    if (status === "true" || status === "false") {
      const result = encryptData(String(status));
      if (result?.encryptedData) {
        existingCompany.status = result.encryptedData;
      }
    }


    await existingCompany.save();

    return res.status(200).json(
      successResponse(200, "Company updated successfully", "", true, "")
    );
  } catch (error) {
    console.error("Update Company Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};


export const getAllAdmCompanies = async (req, res) => {
  try {
    const user=req.user
  
    const companies = await AdmCompany.find({userId:user});

    const decryptedCompanies = companies.map((company) => ({
      _id: company._id,
      CompanyName: decryptData(company.CompanyName),
      CompanyMobile: decryptData(company.CompanyMobile),
      Companyemail: decryptData(company.Companyemail),
      status: decryptData(company.status),
      userId: company.user,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(200, "Companies fetched","", true,decryptedCompanies)
      );
  } catch (error) {
    console.error("Get All Companies Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};

export const deleteAdmCompany = async (req, res) => {
  try {
    const company = await AdmCompany.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


