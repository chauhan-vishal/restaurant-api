const mongoose = require("mongoose")

const cuisineSchema = mongoose.Schema({
    name: { type: String, required: true },
    description : String,
    status: { type: String, default: "false" },
   
    },
    {
    timestamps: true
    }
);

const Cuisine = mongoose.model("Cuisine", cuisineSchema)

module.exports = Cuisine