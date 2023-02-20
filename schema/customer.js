const mongoose = require("mongoose")

const customerSchema = mongoose.Schema({
    name: { type: Map, required: true },
    email: String,
    contact: String,
    gender: String,
    dates: Map,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

customerSchema.methods.exists = async function () {
    return await Customer.count({ email: this.email }) == 1
}

const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer