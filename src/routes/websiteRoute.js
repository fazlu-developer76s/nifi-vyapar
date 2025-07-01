import express from "express";
import { getCompanyByDomain } from "../middlewares/getcompnaybydomain.js";
import { CMS } from "../models/cms.js";
import { errorResponse, successResponse } from "../lib/reply.js";

const websiterouter = express.Router();
websiterouter.use((req, res, next) => {
  req.requestHeaders = req.headers;
  req.requestHost = req.headers.host;
  next();
});
websiterouter.get("/CompanyDomain", getCompanyByDomain, async (req, res) => {
  try {
    const userId = req.company.userId;

    const cmsData = await CMS.find({ userId, status: true });

    const pages = {};
    cmsData.forEach((item) => {
      if (!pages[item.page]) pages[item.page] = [];
      pages[item.page].push(...item.sections);
    });

    return res.status(200).json(
      successResponse(200, "CMS data fetched successfully",null, true, {
        domain: req.company.CompanyDomain,
        pages,
      })
    );
  } catch (err) {
    console.error("Error fetching CMS content:", err);
    return res
      .status(500)
      .json(errorResponse(500, "something went wrong", false));
  }
});

export default websiterouter;
