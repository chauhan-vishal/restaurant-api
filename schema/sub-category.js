const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    desc: String,
    cuisineId: { type: mongoose.Schema.Types.ObjectId, ref: "Cuisine", required: true },
    status: String
}, {
    timestamps: true
})

subCategorySchema.methods.exists = async function (cName = this.name) {
    return await SubCategory.count({ name: cName }) == 1;
}

subCategorySchema.methods.getId = async function () {
    return await SubCategory.findOne({ name: this.name })
}

subCategorySchema.methods.delete = async function () {
    return await SubCategory.deleteOne({ name: this.name })
}

const SubCategory = mongoose.model("SubCategory", subCategorySchema)

module.exports = SubCategory