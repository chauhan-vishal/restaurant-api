const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    img: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
})

itemSchema.methods.exists = async function (itemName = this.name) {
    return await Item.count({ name: itemName }) == 1;
}

itemSchema.methods.getId = async function () {
    return await Item.findOne({ name: this.name })
}

itemSchema.methods.delete = async function () {
    return await Item.deleteOne({ name: this.name })
}

const Item = mongoose.model("Item", itemSchema)

module.exports = Item