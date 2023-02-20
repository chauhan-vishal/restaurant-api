const mongoose = require("mongoose")

const cuisineSchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, required: true },
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

cuisineSchema.methods.exists = async function (cName = this.name) {
    return await Cuisine.count({ name: cName }) == 1;
}

cuisineSchema.methods.getId = async function () {
    return await Cuisine.findOne({ name: this.name })
}

cuisineSchema.methods.delete = async function () {
    return await Cuisine.deleteOne({ name: this.name })
}

const Cuisine = mongoose.model("Cuisine", cuisineSchema)

module.exports = Cuisine