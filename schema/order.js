const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    tableId: mongoose.Schema.Types.ObjectId,
    employeeId: mongoose.Schema.Types.ObjectId,
    orderDate: Date,
    items: String,
    amount: Number
}, {
    timestamps: true
})

const Order = mongoose.model("order", orderSchema)

module.exports = Order 