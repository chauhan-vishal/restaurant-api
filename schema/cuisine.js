const mongoose = require("mongoose")

const cuisineSchema = mongoose.Schema({
    name: { type: String, required: true },
    description : String,
    status: { type: String, default: "false" },
    created_at: { default: new Date(), immutable: true },
    updated_at: new Date()
})

const Cuisine = mongoose.model("Cuisine", cuisineSchema)

module.exports.Cuisine = Cuisine