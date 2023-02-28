const mongoose = require("mongoose")

const paymentSchema = mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    billNo: { type: String, required: true },
    discount: Number,
    tax: Number,
    amount: { type: Number, required: true },
    method: { type: String, required: true }
}, {
    timestamps: true
})

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment