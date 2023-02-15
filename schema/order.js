const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
   customerId:mongoose.SchemaTypes.ObjectId,
   amount: Number,
   orderDate:Date,
   items:String,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

const Order = mongoose.model("order", orderSchema )

module.exports = Order 