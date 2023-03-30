const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: "Table", required: true },
    orderDate: { type: Date, required: true },
    items: { type: Array, required: true },
    desc: String,
    qty:Number,
    amount: { type: Number, required: true }
}, {
    timestamps: true
})

orderSchema.methods.delete = async function () {
    return await Order.deleteOne({ _id: this.id })
}

const Order = mongoose.model("order", orderSchema)

module.exports = Order 