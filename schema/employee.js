const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    pincode: String
})

const employeeSchema = mongoose.Schema({
    name: { type: Map, required: true },
    gender: String,
    contact: String,
    email: String,
    address: addressSchema,
    dob: Date,
    doj: Date,
    departmentId: mongoose.Schema.Types.ObjectId,
    salary: Number,
    allowances: { type: Map }
})

employeeSchema.methods.exists = async function () {
    return await Employee.count({ email: this.email }) == 1
}

employeeSchema.methods.delete = async function() {
    return await Employee.deleteOne({email : this.email})
}

const Employee = mongoose.model("Employee", employeeSchema)

module.exports = Employee