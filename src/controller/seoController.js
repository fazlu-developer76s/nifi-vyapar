import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js"
import Seo from "../models/seoModel.js";

// const createSeo=async(req,res)=>{
//  try{
//     const { body } = req.body;
//     const decryptedBody = decryptData(body);
//     const parsedBody = JSON.parse(decryptedBody);
//     const {page,title,description,keywords,url,image } = parsedBody;

//     if (!page || !title || !description || !keywords || !url) {
//         return res.status(400).json(errorResponse(400, "All fields are required.", false));
//       }

//     const encryptedPage = encryptData(JSON.stringify(page))?.encryptedData
//     const encryptedTitle = encryptData(JSON.stringify(title))?.encryptedData
//     const encryptedDescription = encryptData(JSON.stringify(description))?.encryptedData
//     const encryptedKeywords = encryptData(JSON.stringify(keywords))?.encryptedData
//     const encryptedUrl = encryptData(JSON.stringify(url))?.encryptedData
    

//     const seo = await Seo.create({
//         page: encryptedPage,
//         title: encryptedTitle,
//         description: encryptedDescription,
//         keywords: encryptedKeywords,
//         url: encryptedUrl,
//         image: image
//     });
//     return res.status(200).json((errorResponse(200,"Seo created successfully",seo,true)))
//   }
//   catch (error) {
//     return res.status(500).json((errorResponse(500,"something went wrong","",false)))
//   }
// }
// const getSeo=async(req,res)=>{
//     try{
//         const {page} = req.query;
//         if (!page) {
//             return res.status(400).json(errorResponse(400, "Page is required.", false));
//           }
//         const seo = await Seo.findOne({ where: { page } });
//         if (!seo) {
//             return res.status(404).json(errorResponse(404, "Seo not found", false));
//           }
//         const decryptedSeo = {
//             ...seo,
//             page: decryptData(seo.page),
//             title: decryptData(seo.title),
//             description: decryptData(seo.description),
//             keywords: decryptData(seo.keywords),
//             url: decryptData(seo.url),
//             // image: image
//         };
//         return res.status(200).json((successResponse(200,"Seo fetched successfully",decryptedSeo,true)))



//  }catch(error){
//     return res.status(500).json((errorResponse(500,"something went wrong","",false)))
//  }  
// }




const createSeo = async (req, res) => {
  try {
    // const { body } = req.body;

    // // Decrypt the incoming payload
    // const decryptedBody = decryptData(body);
    // const parsedBody = JSON.parse(decryptedBody);

    const { page, title, description, keywords, url, image, createdBy } = req.decryptedBody;

    if (!page || !title || !description || !keywords || !url) {

      return res.status(400).json(errorResponse(400, "All required SEO fields must be provided.", false));
    }

    // Check if SEO already exists for this page
    const existingSeo = await Seo.findOne({ page });
    if (existingSeo) {
      
      return res.status(409).json(errorResponse(409, "SEO for this page already exists.", false));
    }

    // Encrypt sensitive fields
    const encryptedTitle = encryptData(JSON.stringify(title)).encryptedData;

    const encryptedDescription = encryptData(JSON.stringify(description))?.encryptedData;
    const encryptedKeywords = encryptData(JSON.stringify(keywords))?.encryptedData;

    // Create new SEO document
    const newSeo = await Seo.create({
      page,
      title: encryptedTitle,
      description: encryptedDescription,
      keywords: encryptedKeywords,
      url,
      image,
      createdBy,
    });

    const responsePayload = {
      message: "SEO created successfully.",
      data: {
        page,
        title: encryptedTitle,
        description: encryptedDescription,
        keywords: encryptedKeywords,
        url,
        image,
        createdBy,
      },
    };

    return res
      .status(201)
      .json(successResponse(201, "SEO created successfully.", "", true, responsePayload));
  } catch (error) {
    return res.status(500).json(errorResponse(500, "Failed to create SEO data", false));
  }
};

 const getSeo = async (req, res) => {
  try {
    // Get page parameter from the request (e.g., /seo/home)
    const { page } = req.params;

    // Find the SEO data based on the 'page'
    const seo = await Seo.findOne({ page });

    if (!seo) {
      return res.status(404).json({ message: "SEO data not found for this page." });
    }

    // Decrypt the encrypted fields
    const decryptedTitle = decryptData(seo.title);
    const decryptedDescription = decryptData(seo.description);
    const decryptedKeywords = decryptData(seo.keywords);

    // Log decrypted data for debugging (optional)
    console.log("Decrypted Title:", decryptedTitle);
    console.log("Decrypted Description:", decryptedDescription);
    console.log("Decrypted Keywords:", decryptedKeywords);

    // Prepare the response
    const responsePayload = {
      page: seo.page,
      title: decryptedTitle,
      description: decryptedDescription,
      keywords: decryptedKeywords,
      url: seo.url,
      image: seo.image,
    };

    
    return res.status(200).json(successResponse(200, "SEO data retrieved successfully.", "", true, responsePayload));
  } catch (error) {
    console.error("Error:", error.message);

    return res.status(500).json(errorResponse(500, "Failed to fetch SEO data", false));
  }
};

export {createSeo,getSeo}