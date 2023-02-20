const mongoose = require("mongoose")

const departmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

departmentSchema.methods.exists = async function (dName = this.name) {
    return await Department.count({ name: dName }) == 1;
}

departmentSchema.methods.getId = async function () {
    return await Department.findOne({ name: this.name })
}

departmentSchema.methods.delete = async function () {
    return await Department.deleteOne({ name: this.name })
}

const Department = mongoose.model("Department", departmentSchema)

module.exports = Department