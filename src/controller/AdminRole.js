import { decryptData, encryptData } from "../lib/encrypt.js";
import { errorResponse, successResponse } from "../lib/reply.js";
import { AdminRole } from "../models/AdminRoleModel.js";

const createRole = async (req, res) => {
    try {
      
      // const { body } = req.body;
      // const decryptbodydata = decryptData(body);
      // const parsebodyData = JSON.parse(decryptbodydata);
      const { AdminRolename, status = "true" } = req.decryptedBody;
  
       
  
          if (!AdminRolename) {
              return res.status(400).json(errorResponse(400, "Please Provide a Role.", false));
          }
  
          const findroleData= await AdminRole.findOne({AdminRolename:AdminRolename})
          if(findroleData){
              return res.status(404).json(errorResponse(404, "this Role already exist", false))
          }
         
  
          let encryptedStatus;
          if (status === '') {
              encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData
  
          } else {
              if (status !== "true" && status !== "false") {
                  return res.status(400).json(errorResponse(400, "Invalid status. Only true or false are allowed.", false));
              }
  
          }
          const encryptedAdminRolename = encryptData(JSON.stringify(AdminRolename))?.encryptedData;
           encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData
  
  
          const role = await AdminRole.create({ AdminRolename: encryptedAdminRolename, status: encryptedStatus});
  
          if (!role) {
              return res.status(404).json(errorResponse(404, "failed to create", false))
          }
          return res.status(201).json(successResponse(201, "role created successfully", "", true, ""));
      } catch (error) {
          return res.status(501).json(errorResponse(501, "Something went wrong", false));
      }
  };
  


//     try {
     
//         const findData = await AdminRole.find({});
//         if (!findData || findData.length === 0) {
//             return res.status(404).json(errorResponse(404, "No role found", false));
//         }

//         const decryptedPackages = findData.map(roleItem => {
//             return {
//                 RoleName: JSON.parse(decryptData(roleItem.AdminRolename)),
           
              
//                 status: JSON.parse(decryptData(roleItem.status)),
//                 // packageLink: packageItem.packageLink, 
//                 _id: roleItem._id
//             };
//         });

//         return res.status(201).json(successResponse(201, "get data successfully", "", true, decryptedPackages));
//     } catch (error) {

//         return res.status(503).json(errorResponse(503, "Something went wrong", false));
//     }

// };
// const getRoleById = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const findData = await AdminRole.findById(id);
//       if (!findData) {
//         return res.status(404).json(errorResponse(404, "Not found", false));
//       }
  
//       // Use the correct field name as stored in your database
//       const decryptedAdminRolename = JSON.parse(decryptData(findData.AdminRolename));
//       const decryptedStatus = JSON.parse(decryptData(findData.status));
  
//       const roleData = {
//         AdminRolename: decryptedAdminRolename,
//         status: decryptedStatus,
//         _id: findData._id,
//       };
  
//       return res.status(200).json(successResponse(200, "Fetched role data", roleData, true));
//     } catch (error) {
//       console.error("Error in getRoleById:", error);
//       return res.status(503).json(errorResponse(503, "Something went wrong", false));
//     }
//   };
 
  const updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      // const { body } = req.body;
  
      // const decryptedData = decryptData(body);
      // const parsedData = JSON.parse(decryptedData);
      const { AdminRolename, status } = req.decryptedBody;
  
      if (!AdminRolename || status === undefined) {
        return res.status(400).json(errorResponse(400, "Missing fields", false));
      }
  
      const encryptedName = encryptData(JSON.stringify(AdminRolename))?.encryptedData;
      const encryptedStatus = encryptData(JSON.stringify(status))?.encryptedData;
  
      const updated = await AdminRole.findByIdAndUpdate(id, {
        AdminRolename: encryptedName,
        status: encryptedStatus,
      }, { new: true });
  
      if (!updated) {
        return res.status(404).json(errorResponse(404, "Role not found", false));
      }
  
      return res.status(200).json(successResponse(200, "Role updated successfully", "", true));
    } catch (error) {
      return res.status(500).json(errorResponse(500, "Server error", false, error.message));
    }
  };
  


const getRoles = async (req, res) => {
    try {
      const roles = await AdminRole.find().sort({ createdAt: -1 });
  
      const decryptedRoles = roles.map(role => ({
        _id: role._id,
        AdminRolename: JSON.parse(decryptData(role.AdminRolename)),
        status: JSON.parse(decryptData(role.status)),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }));
  
      return res.status(200).json(successResponse(200, "All roles fetched successfully", "", true, decryptedRoles));
    } catch (error) {
      return res.status(500).json(errorResponse(500, "Server error", false, error.message));
    }
  };
 
  const getRoleById = async (req, res) => {
    try {
      const { id } = req.params;
      const role = await AdminRole.findById(id);
  
      if (!role) {
        return res.status(404).json(errorResponse(404, "Role not found", false));
      }
  
      const decryptedRole = {
        _id: role._id,
        AdminRolename: JSON.parse(decryptData(role.AdminRolename)),
        status: JSON.parse(decryptData(role.status)),
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      };
  
      return res.status(200).json(successResponse(200, "Role fetched successfully", "", true, decryptedRole));
    } catch (error) {
      return res.status(500).json(errorResponse(500, "Server error", false, error.message));
    }
  };

const deleteRole = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await AdminRole.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json(errorResponse(404, "Role not found", false));
      }
  
      return res.status(200).json(successResponse(200, "Role deleted successfully", "", true));
    } catch (error) {
      return res.status(500).json(errorResponse(500, "Server error", false, error.message));
    }
  };

  export{createRole,getRoles,getRoleById,updateRole,deleteRole}