const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    orderDate: { type: Date, required: true },
    items: { type: String, required: true },
    amount: { type: Number, required: true }
}, {
    timestamps: true
})

const Order = mongoose.model("order", orderSchema)

module.exports = Order 