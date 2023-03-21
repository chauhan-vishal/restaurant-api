const bcrypt = require('bcrypt');
const mongoose = require("mongoose")
const CONSTANTS = require("../constants")
const jwt = require("jsonwebtoken");
const { RolesAnywhere } = require('aws-sdk');

const roleSchema = mongoose.Schema({
    
    rolename: { type: String, required: true, unique: true },
    roledesc: { type: String, required : true },
    status: { type: String, default: "inactive" }

})

roleSchema.methods.rolenameExists = async function () {
    return await RolesAnywhere.count({ rolename: this.rolename }) == 1
}
roleSchema.methods.getId = async function () {
    return await Role.findOne({ rolename: this.rolename })
}

// roleSchema.methods.delete = async function () {
//     return await Role.deleteOne({ name: this.rolename })
// }


const Role = mongoose.model("Role", roleSchema)
module.exports = Role  