
import Role from "../models/roleModel.js";
export const createRole = async (req, res) => {
    try {
      const { role } = req.body;
  
      if (!role) {
        return res.status(400).json({ error: "Role is required." });
      }
  
      const existingRole = await Role.findOne({ role });
      if (existingRole) {
        return res.status(400).json({ error: "Role already exists." });
      }
  
      const saveRole = await Role.create({ role });
  
      return res.status(201).json({
        message: "Role created successfully",
        data: saveRole
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  
    

export const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({
            message: "Roles fetched successfully",
            data: roles
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const roleDoc = await Role.findByIdAndUpdate(id);
      if (!roleDoc) {
        return res.status(404).json({ message: "Role not found." });
      }
    //   check role already exist
     const check_role = await Role.findOne({ role: req.body.role, _id : { $ne: id } });
     if(check_role) {
        return res.status(400).json({ message: "Role already exists." });
      }
      if(req.body.status){
        roleDoc.status = req.body.status;
      }
      if(req.body.role){
        roleDoc.role = req.body.role;
      }
      await roleDoc.save();
  
      return res.status(200).json({ message: `Role update successfully` });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  
  
  

export const deleteRole = async (req, res) => {
    try {
        const deleted = await Role.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Role not found." });
        res.status(200).json({ message: "Role deleted." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


