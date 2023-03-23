const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    desc: String,
    img: String,
    cuisineId: { type: mongoose.Schema.Types.ObjectId, ref: "Cuisine", required: true },
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
})

categorySchema.methods.exists = async function (cName = this.name) {
    return await Category.count({ name: cName }) == 1;
}

categorySchema.methods.getId = async function () {
    return await Category.findOne({ name: this.name })
}

categorySchema.methods.delete = async function () {
    return await Category.deleteOne({ name: this.name })
}

const Category = mongoose.model("Category", categorySchema)

module.exports = Category