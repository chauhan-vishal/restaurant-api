const { Schema } = require("mongoose");
const mongoose = ("mongoose");

const categroySchema = mongoose.Schema({
    name: { type: String, required: true },
    description : String,
    cuisineId : Schema.Types.ObjectId,
    status: { type: String, default: "false" },
    },
    {
    timestamps: true
    }
);

module.exports = mongoose.model('Category',categroySchema)   
