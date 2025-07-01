import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Company } from "../models/Company.js";
import User from "../models/User.js";

// const createCompany = async (req, res) => {
//   try {
//     const { body } = req.body;

//     const decryptedBody = decryptData(body);
//     const parsedBody = JSON.parse(decryptedBody);
//     const {
//       CompanyName,
//       CompanyDomain,
//       CompanyMobile,
//       Companyemail,
//       status = true,
//     } = parsedBody;

//     const user = req.user;
//     console.log(user)

//     if (!CompanyName || !CompanyDomain || !CompanyMobile || !Companyemail) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Missing required fields", false));
//     }

//     if (status !== true && status !== false) {
//       return res
//         .status(400)
//         .json(
//           errorResponse(
//             400,
//             "Invalid status. Only true or false allowed.",
//             false
//           )
//         );
//     }

//     const encryptedName = encryptData(
//       JSON.stringify(CompanyName)
//     )?.encryptedData;
//     const encryptedDomain = encryptData(
//       JSON.stringify(CompanyDomain)
//     )?.encryptedData;
//     const encryptedMobile = encryptData(
//       JSON.stringify(CompanyMobile)
//     )?.encryptedData;
//     const encryptedEmail = encryptData(
//       JSON.stringify(Companyemail)
//     )?.encryptedData;
//     const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

//     const existUser = await User.findOne({ _id: user?.id });
//     if (!existUser) {
//       return res.status(404).json(errorResponse(404, "User not found", false));
//     }

//     const existingCompany = await Company.findOne({
//       Companyemail: encryptedEmail,
//     });
//     if (existingCompany) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Company email already exists", false));
//     }

//     const newCompany = new Company({
//       CompanyName: encryptedName,
//       CompanyDomain: encryptedDomain,
//       CompanyMobile: encryptedMobile,
//       Companyemail: encryptedEmail,
//       status: encryptedStatus,
//       userId: user?.id,
//     });

//     if (!newCompany) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Failed to create company", false));
//     }

//     existUser.companyDetails = {
//       company_Id: newCompany._id,
//     };

//     await existUser.save();
//     await newCompany.save();

//     return res
//       .status(201)
//       .json(successResponse(201, "Company created successfully", "", true, ""));
//   } catch (error) {
//     console.error("Create Company Error:", error);
//     return res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong.", false));
//   }
// };


const createCompany = async (req, res) => {
  try {
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);
    const {
      CompanyName,
      CompanyDomain,
      CompanyMobile,
      Companyemail,
      userId,
      status = true,
    } = req.decryptedBody;

 
    if (!CompanyName || !CompanyDomain || !CompanyMobile || !Companyemail || !userId) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }

    if (status !== true && status !== false) {
      return res
        .status(400)
        .json(errorResponse(400, "Invalid status. Only true or false allowed.", false));
    }

 
    const encryptedName = encryptData(JSON.stringify(CompanyName))?.encryptedData;
    const encryptedDomain = encryptData(JSON.stringify(CompanyDomain))?.encryptedData;
    const encryptedMobile = encryptData(JSON.stringify(CompanyMobile))?.encryptedData;
    const encryptedEmail = encryptData(JSON.stringify(Companyemail))?.encryptedData;
    const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;

  
    const existUser = await User.findById(userId);
    if (!existUser) {
      return res.status(404).json(errorResponse(404, "User not found", false));
    }

   
    const existingCompany = await Company.findOne({ Companyemail: encryptedEmail });
    if (existingCompany) {
      return res
        .status(400)
        .json(errorResponse(400, "Company email already exists", false));
    }

 
    const newCompany = new Company({
      CompanyName: encryptedName,
      CompanyDomain: encryptedDomain,
      CompanyMobile: encryptedMobile,
      Companyemail: encryptedEmail,
      status: encryptedStatus,
      userId: userId,
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


const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();

    const decryptedCompanies = companies.map((company) => ({
      _id: company._id,
      CompanyName: JSON.parse(decryptData(company.CompanyName)),
      CompanyDomain: JSON.parse(decryptData(company.CompanyDomain)),
      CompanyMobile: JSON.parse(decryptData(company.CompanyMobile)),
      Companyemail: JSON.parse(decryptData(company.Companyemail)),
      status: JSON.parse(decryptData(company.status)),
      userId: company.userId,
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


const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found", false));
    }

    const decryptedCompany = {
      _id: company._id,
      CompanyName: JSON.parse(decryptData(company.CompanyName)),
      CompanyDomain: JSON.parse(decryptData(company.CompanyDomain)),
      CompanyMobile: JSON.parse(decryptData(company.CompanyMobile)),
      Companyemail: JSON.parse(decryptData(company.Companyemail)),
      status: JSON.parse(decryptData(company.status)), 
      userId: company.userId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };

    return res
      .status(200)
      .json(
        successResponse(200, "Company fetched", "",true, decryptedCompany )
      );
  } catch (error) {
    console.error("Get Company Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};


const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    // const { body } = req.body;

    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);
    const { CompanyName, CompanyDomain, CompanyMobile, Companyemail, status } =req.decryptedBody;

    const existingCompany = await Company.findById(id);
    if (!existingCompany) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found", false));
    }

  
    if (CompanyName)
      existingCompany.CompanyName = encryptData(
        JSON.stringify(CompanyName)
      ).encryptedData;
    if (CompanyDomain)
      existingCompany.CompanyDomain = encryptData(
        JSON.stringify(CompanyDomain)
      ).encryptedData;
    if (CompanyMobile)
      existingCompany.CompanyMobile = encryptData(
        JSON.stringify(CompanyMobile)
      ).encryptedData;
    if (Companyemail)
      existingCompany.Companyemail = encryptData(
        JSON.stringify(Companyemail)
      ).encryptedData;
    if (status === true || status === false) {
      existingCompany.status = encryptData(
        JSON.stringify(status)
      ).encryptedData;
    }

    await existingCompany.save();

    return res
      .status(200)
      .json(successResponse(200, "Company updated successfully", "", true, ""));
  } catch (error) {
    console.error("Update Company Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong.", false));
  }
};


const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ message: "Company deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export {
  createCompany,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getAllCompanies,

};

