import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { AdmCompany } from "../models/userAdminCompany.js";
import User from "../models/User.js";
import { Usermember } from "../models/Usermanagement.js";

export const createAdmCompany = async (req, res) => {
  try {

    const user = req.user;
    const { CompanyName, CompanyMobile, Companyemail, address, gstIn, status } =
      req.decryptedBody;

    if (!CompanyName || !CompanyMobile || !Companyemail) {
      return res
        .status(400)
        .json(errorResponse(400, "Missing required fields", false));
    }
    const encryptedName = encryptData(CompanyName)?.encryptedData;
    const encryptedMobile = encryptData(CompanyMobile)?.encryptedData;
    const encryptedEmail = encryptData(Companyemail)?.encryptedData;
    const encryptedAddress = encryptData(address)?.encryptedData;
    const encryptedGstIn = encryptData(gstIn)?.encryptedData;
    const encryptedStatus = encryptData(
      String(status || "true")
    )?.encryptedData;
    const existUser = await User.findById(user);
    if (!existUser) {
      return res.status(404).json(errorResponse(404, "User not found", false));
    }
    const existingCompany = await AdmCompany.findOne({
      Companyemail:encryptedEmail,
      userId:user 
    });

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
      address: encryptedAddress,
      gstIn: encryptedGstIn,
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
    const { CompanyName, CompanyMobile, Companyemail, status, address, gstIn } =
      req.decryptedBody;

    const existingCompany = await AdmCompany.findById(id);
    if (!existingCompany) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found", false));
    }

  const exitcompany = await AdmCompany.findOne({
      Companyemail: encryptData(Companyemail)?.encryptedData,
      _id: { $ne: id },
      userId: req.user
    });

  

    if (exitcompany) {
      return res
        .status(400)
        .json(errorResponse(400, "Company email already exists", false));
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
    if (address) {
      const result = encryptData(address);
      if (result?.encryptedData) {
        existingCompany.address = result.encryptedData;
      }
    }
    if (gstIn) {
      const result = encryptData(gstIn);
      if (result?.encryptedData) {
        existingCompany.gstIn = result.encryptedData;
      }
    }

    if (status === "true" || status === "false") {
      const result = encryptData(String(status));
      if (result?.encryptedData) {
        existingCompany.status = result.encryptedData;
      }
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

export const getAllAdmCompanies = async (req, res) => {
  try {
    const user = req.user;

    const companies = await AdmCompany.find({ userId: user }).populate(
      "members"
    );
    const decryptedCompanies = companies.map((company) => ({
      _id: company._id,
      CompanyName: company.CompanyName
        ? decryptData(company.CompanyName)
        : null,
      CompanyMobile: company.CompanyMobile
        ? decryptData(company.CompanyMobile)
        : null,
      Companyemail: company.Companyemail
        ? decryptData(company.Companyemail)
        : null,
      status: company.status ? decryptData(company.status) : null,
      address: company.address ? decryptData(company.address) : null,
      gstIn: company.gstIn ? decryptData(company.gstIn) : null,
      userId: company.userId,
      members:
        company.members?.map((member) => ({
          _id: member._id,
          name: member.name ? (decryptData(member.name)) : null,
          email: member.email ? (decryptData(member.email)) : null,
          mobile: member.mobile ? (decryptData(member.mobile)) : null,
        })) || [],
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }));

    return res
      .status(200)
      .json(
        successResponse(200, "Companies fetched", "", true, decryptedCompanies)
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

// export const assignMemberToCompany = async (req, res) => {
//   try {
//         const { body } = req.body;

//     const decryptedBody = decryptData(body);
//     const parsedBody = JSON.parse(decryptedBody);

//     const { companyId, memberId } = parsedBody;

//     const company = await AdmCompany.findById(companyId);
//     const member = await Usermember.findById(memberId);

//     if (!company || !member) {
//       return res.status(404).json(errorResponse(404, "Company or Member not found", false));
//     }

//     // if (!company.members?.includes(memberId)) {
//     //   company.members?.push(memberId);
//     //   await company.save();
//     // }

//     // member.companyDetails = { company_Id: company._id };
//     await member.save();

//     return res.status(200).json(
//       successResponse(200, "Member assigned successfully", "", true, {
//         companyId,
//         memberId,
//       })
//     );
//   } catch (error) {
//     console.error("Assign Member Error:", error);
//     return res.status(500).json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const assignMemberToCompany = async (req, res) => {
  try {
    const { body } = req.body;
    const decryptedBody = decryptData(body);
    const parsedBody = JSON.parse(decryptedBody);

    const { companyId, memberId } = parsedBody;

    const company = await AdmCompany.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json(errorResponse(404, "Company not found", false));
    }

    const memberIds = Array.isArray(memberId) ? memberId : [memberId];

    for (const id of memberIds) {
      const member = await Usermember.findById(id);
      if (!member) continue;

      if (!company.members?.includes(id)) {
        company.members?.push(id);
      }

      member.companyDetails = { company_Id: company._id };
      await member.save();
    }

    await company.save();

    return res.status(200).json(
      successResponse(200, "Member(s) assigned successfully", "", true, {
        companyId,
        memberIds,
      })
    );
  } catch (error) {
    console.error("Assign Member Error:", error);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
