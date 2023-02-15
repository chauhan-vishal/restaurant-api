const mongoose = require("mongoose")

const employeeSchema = mongoose.Schema({
    name: { type: Map, required: true },
    gender: String,
    contact: String,
    email: String,
    address: String,
    dob: Date,
    doj: Date,
    departmentId: mongoose.Schema.Types.ObjectId,
    salary: Number,
    allowances: { type: Map }
})

const Employee = mongoose.model("Employee", employeeSchema)

module.exports = Employee