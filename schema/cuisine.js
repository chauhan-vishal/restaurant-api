const mongoose = require("mongoose")

const cuisineSchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

const  Cuisine = mongoose.model("Cuisine", cuisineSchema)

module.exports = Cuisine