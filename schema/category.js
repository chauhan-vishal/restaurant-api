const { Schema } = require("mongoose");
const mongoose = ("mongoose");

const categroySchema = mongoose.Schema({
    name: { type: String, required: true },
    description : String,
    cuisineId : Schema.Types.ObjectId,
    status: { type: String, default: "false" },
    created_at: { default: new Date(), immutable: true },
    updated_at: new Date()
})

module.exports = mongoose.model('Category',categroySchema)   
