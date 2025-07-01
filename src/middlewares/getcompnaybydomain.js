import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { Company } from "../models/Company.js";

// export const getCompanyByDomain = async (req, res, next) => {
//   try {
//     const headers=req.headers
//     const origin=req.headers.origin
//     const referer=req.headers.referer
//     const host = headers.host;
//      console.log("Full Request Headers:", headers);

//       console.log("All Request Headers:", host);

//     const encryptedhost = encryptData(JSON.stringify(host)).encryptedData;

//     const company = await Company.findOne({ CompanyDomain: encryptedhost });
//     // console.log(company, "data")
//    if(company){
//     return res.status(200).json(successResponse(200,"company found", null,true))
//    }

//     // if (!company) return res.status(404).send("Company domain not found");
//     if (!company) {
//   return res.status(404).json({
//     message: "Company domain not found",
//     headers:headers,
//     origin:origin,
//     referer:referer
//   });
// }
//  const allowed = company.allowedOrigins || [];

//     const isValidOrigin = allowed.some(domain =>
//       (origin && origin.includes(domain)) || (referer && referer.includes(domain))
//     );

//     if (!isValidOrigin) {
//       return res.status(403).json({
//         message: "Origin or referer not allowed",
//         origin,
//         referer,
//         allowed
//       });
//     }

//     req.company = company;
//     req.requestHeaders = headers;  // full headers
//     req.requestHost = host;

//     next();

//   } catch (err) {
//     console.error("Domain lookup error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// export const getCompanyByDomain = async (req, res, next) => {
//   try {

//     const fullHost = req.headers.host;

//     const domain = fullHost.split(':')[0];
//     console.log("Requested domain:", domain);

//     const encryptedDomain = encryptData(JSON.stringify(domain)).encryptedData;

//     const company = await Company.findOne({ CompanyDomain: encryptedDomain });

//     if (!company) {
//       return res.status(404).json({
//         message: "Company domain not found",
//         domain:domain,
//       });
//     }

//     req.company = company;
//     req.requestHeaders = req.headers;
//     req.domain = domain;

//     next();
//   } catch (err) {
//     console.error("Domain lookup error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// export const getCompanyByDomain = async (req, res, next) => {
//   try {
//     const headers = req.headers;
//     const origin = headers.origin;
//     const referer = headers.referer;
//     const host = headers.host;

//     console.log("Host:", host);
//     console.log("Origin:", origin);
//     console.log("Referer:", referer);

//     // Encrypt host
//     const encryptedHost = encryptData(JSON.stringify(host)).encryptedData;

//     // Find company by encrypted host
//     const company = await Company.findOne({ CompanyDomain: encryptedHost });

//     if (!company) {
//       return res.status(404).json({
//         message: "Company domain not found",
//         host,
//         origin,
//         referer
//       });
//     }

//     // Check if origin or referer matches any allowedOrigins
//     const allowed = company.allowedOrigins || [];

//     const isValidOrigin = allowed.some(domain =>
//       (origin && origin.includes(domain)) || (referer && referer.includes(domain))
//     );

//     if (!isValidOrigin) {
//       return res.status(403).json({
//         message: "Origin or Referer not allowed",
//         origin,
//         referer,
//         allowed
//       });
//     }

//     // If matched — respond with 200 OK
//     req.company = company;
//     req.requestHeaders = headers;
//     req.requestHost = host;

//     return res.status(200).json({
//       message: "Company and origin matched successfully",
//       company: {
//         name: company.name,
//         domain: host
//       }
//     });

//   } catch (err) {
//     console.error("Domain lookup error:", err);
//     res.status(500).send("Server Error");
//   }
// };

// export const getCompanyByDomain = async (req, res) => {
//   try {
//     const { origin, referer, host } = req.headers;

//     console.log("Origin:", origin);
//     console.log("Referer:", referer);
//     console.log("Host:", host);

//     if (!origin) {
//       return res.status(400).json(errorResponse(400, "Origin header is missing",false));
//     }
//     const companies = await Company.find();

//     let matchedCompany = null;

//     for (const company of companies) {
//       const decryptedDomain = decryptData(company.CompanyDomain);
//       console.log(decryptedDomain,"hjj")

//       // Compare full origin (like https://example.com) with decrypted domain
//       if (origin.includes(decryptedDomain)) {
//         matchedCompany = company;
//         break;
//       }
//     }
// if (!matchedCompany) {
//   return res.status(404).json(
//     errorResponse(404, "Company domain not found", false, {
//       origin,
//       host,
//       referer
//     })
//   );
// }
// return res.status(200).json(
//   successResponse(200, "Company domain found",null,true, {
//     name: matchedCompany.name,
//     domain: decryptedDomain
//   })
// );

//   } catch (err) {
//     console.error("Domain lookup error:", err);
//     res.status(500).json(errorResponse(500,"something went wrong",false));
//   }
// };
// export const getCompanyByDomain = async (req, res) => {
//   try {
//     const { origin, referer, host } = req.headers;

//     console.log("Origin:", origin);
//     console.log("Referer:", referer);
//     console.log("Host:", host);

//     if (!origin) {
//       return res
//         .status(400)
//         .json(errorResponse(400, "Origin header is missing", false));
//     }

//     const companies = await Company.find();
//     let matchedCompany = null;
//     let matchedDomain = null;

//     for (const company of companies) {
//       const decryptedDomain = decryptData(company.CompanyDomain);
//       console.log(decryptedDomain, "hjj");

//       // Match full origin with decrypted domain
//       if (origin.includes(decryptedDomain)) {
//         matchedCompany = company;
//         matchedDomain = decryptedDomain;
//         break;
//       }
//     }

//     if (!matchedCompany) {
//       return res.status(404).json(
//         errorResponse(404, "Company domain not found", false, {
//           origin,
//           host,
//           referer
//         })
//       );
//     }

//     return res.status(200).json(
//       successResponse(200, "Company domain found", true, {
//         name: matchedCompany.name,
//         domain: matchedDomain
//       })
//     );
//   } catch (err) {
//     console.error("Domain lookup error:", err);
//     res
//       .status(500)
//       .json(errorResponse(500, "Something went wrong", false));
//   }
// };

export const getCompanyByDomain = async (req, res,next) => {
  try {
    const originHeader = req.headers.origin;
    if (!originHeader) {
      return res
        .status(400)
        .json(errorResponse(400, "Origin header is missing", false));
    }
    const url = new URL(originHeader);
    const cleanDomain = url.host;

    const encryptedDomain = encryptData(JSON.stringify(cleanDomain))?.encryptedData;
    console.log(encryptedDomain)
    const company = await Company.findOne({CompanyDomain:encryptedDomain});
    console.log(company)

   
    if (!company) {
      return res
        .status(404)
        .json(errorResponse(404, "Company domain not found", false));
    }

     req.company = company;
    next()
  } catch (err) {
    console.error("Domain lookup error:", err);
    return res
      .status(500)
      .json(errorResponse(500, "Something went wrong", false));
  }
};
