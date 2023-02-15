const mongoose = require("mongoose")

const departmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    status: String
}, {
    timestamps: true
})

const Department = mongoose.model("Department", departmentSchema)

module.exports = Department