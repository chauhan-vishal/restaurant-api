const mongoose = require("mongoose")

const addressSchema = mongoose.Schema({
    street: { type: String, required: true },
    city: String,
    state: String,
    country: String,
    pincode: String
})

const employeeSchema = mongoose.Schema({
    name: { type: Map, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: addressSchema,
    dob: Date,
    doj: { type: Date, required: true },
    departmentId: { type: mongoose.Schema.Types.ObjectId, required: true },
    salary: { type: Number, required: true },
    allowances: { type: Map }
},{
    timestamps: true
})

employeeSchema.methods.exists = async function () {
    return await Employee.count({ email: this.email }) == 1
}

employeeSchema.methods.delete = async function () {
    return await Employee.deleteOne({ email: this.email })
}

const Employee = mongoose.model("Employee", employeeSchema)

module.exports = Employee