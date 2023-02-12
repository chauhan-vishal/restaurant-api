const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    categoryId: mongoose.Schema.Types.ObjectId,
    status: String
}, {
    timestamps: true
})

const SubCategory = mongoose.model("SubCategory", subCategorySchema)

module.exports = SubCategory