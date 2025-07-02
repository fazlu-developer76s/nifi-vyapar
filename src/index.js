import express from "express";
import dotenv from "dotenv";

import cors from "cors";

import uploadrouter from "./routes/imageroutes.js";

import router from "./routes/authRoutes.js";
import { mongodbConnection } from "./DB/index.js";
import chechkencrypt from "./routes/checkencrypt.js";
import { adminRoute } from "./routes/AdminRoute.js";
import memberRoutes from "./routes/MemberRoutes.js";
import adminRoleRoute from "./routes/AdminRoleroute.js";
import TestRoutes from "./routes/TestRoutes.js";

import PackageRoutes from "./routes/Packageroutes.js";
import websiterouter from "./routes/websiteRoute.js";
import seoroutes from "./routes/Seoroutes.js";
import userRoleRoutes from "./routes/UserRoleRoutes.js";
import usermanagroutes from "./routes/usermanagroute.js";
import companyRoutes from "./routes/CompanyRoutes.js";
import cmsRoutes from "./routes/CmsRoutes.js";
import partyRoutes from "./routes/PartyRoutes.js";
import validaterouter from "./routes/validaterouter.js";
import CategoryItemrouter from "./routes/categoryItemRoutes.js";
import PrimaryUnitrouter from "./routes/PrimaryUnitRoutes.js";
import SecondaryUnitrouter from "./routes/SecondaryUnitRoutes.js";
import itemCoderouter from "./routes/itemCodeRoutes.js";
import Gstrouter from "./routes/GstRoutes.js";
import Productitemrouter from "./routes/ProductitemRoute.js";
import ServiceItemrouter from "./routes/ServiceItemRoutes.js";
import ServiceCodeItemrouter from "./routes/ServiceItemCode.js";
import userPermission from "./routes/UserPermissionRoutes.js";
import GodownRoutes from "./routes/GodownRoutes.js";
import manageroleRoutes from "./routes/RoleRoutes.js";
import Stockroutes from "./routes/Stockroutes.js";
import Bankrouter from "./routes/BankRoutes.js";
import PermissionSubcatrouter from "./routes/permissionSubCatRoutes.js";
import catpermissionrouter from "./routes/permissionCategoryRoutes.js";
import Unitrouter from "./routes/UnitRoutes.js";
import saleinvoicerouter from "./routes/SaleInvoiceRoutes.js";

import EstimateQuotationrouter from "./routes/estimateQuoRoutes.js";
import saleorderrouter from "./routes/Saleorder.js";
import Chequerouter from "./routes/ChequeRoutes.js";
import ChequeIssuedrouter from "./routes/issueChequeRoutes.js";
import accroutes from "./routes/AccountTypeRoute.js";
import bankTrans from "./routes/bankTransacroutes.js";
import AdmcompanyRoutes from "./routes/admCompanyRoutes.js";
import Supllierroutes from "./routes/SupplierRoutes.js";
import purachseOrderRouter from "./routes/PurchaseOrder.js";
import ImeiRoutes from "./routes/ImeiRoutes.js";
import paymnentRoutes from "./routes/Payment.js";
import StockInRecieving from "./routes/StockRecieving.js";
import productVariantRouter from "./routes/Productvariant.js";
import Hsnrouter from "./routes/HsnRoutes.js";

dotenv.config({
  path: ".env",
});
const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('*', (req, res) => {
//   console.log("Request URI:", req.originalUrl);
//   res.send("Requested URI: " + req.originalUrl);
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// encryptData();
app.use("/api/v1", chechkencrypt);
app.use("/api/v1", router);
app.use("/api/v1", adminRoute);
app.use("/api/v1", uploadrouter);
app.use("/api/v1", PackageRoutes);

app.use("/api/v1", PackageRoutes);
app.use("/api/v1", TestRoutes);

app.use("/api/v1", websiterouter);
app.use("/api/v1", seoroutes);
app.use("/api/v1", userRoleRoutes);
app.use("/api/v1", usermanagroutes);
app.use("/api/v1", TestRoutes);
app.use("/api/v1", memberRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1", cmsRoutes);
app.use("/api/v1", adminRoleRoute);
app.use("/api/v1", partyRoutes);
app.use("/api/v1", validaterouter);
app.use("/api/v1", CategoryItemrouter);
app.use("/api/v1", PrimaryUnitrouter);
app.use("/api/v1", SecondaryUnitrouter);
app.use("/api/v1", itemCoderouter);
app.use("/api/v1", Gstrouter);
app.use("/api/v1", Productitemrouter);
app.use("/api/v1", GodownRoutes);
app.use("/api/v1", manageroleRoutes);
app.use("/api/v1", Stockroutes);
app.use("/api/v1", PermissionSubcatrouter);
app.use("/api/v1", catpermissionrouter);
app.use("/api/v1", ServiceCodeItemrouter);
app.use("/api/v1", ServiceItemrouter);
app.use("/api/v1", userPermission);
app.use("/api/v1", Bankrouter);
app.use("/api/v1", Unitrouter);
app.use("/api/v1", saleinvoicerouter);
app.use("/api/v1", EstimateQuotationrouter);
app.use("/api/v1", saleorderrouter);
app.use("/api/v1", Chequerouter);
app.use("/api/v1", ChequeIssuedrouter);
app.use("/api/v1", accroutes);
app.use("/api/v1", bankTrans);
app.use("/api/v1", AdmcompanyRoutes);
app.use("/api/v1", Supllierroutes);
app.use("/api/v1", purachseOrderRouter);
app.use("/api/v1", ImeiRoutes);
app.use("/api/v1", paymnentRoutes);
app.use("/api/v1", StockInRecieving);
app.use("/api/v1",productVariantRouter);
app.use("/api/v1",Hsnrouter);

mongodbConnection();
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${PORT}`);
});
