const mongoose = require("mongoose");

const categroySchema = mongoose.Schema({
        name: { type: String, required: true },
        description: String,
        cuisineId: mongoose.Schema.Types.ObjectId,
        status: { type: String, default: "inactive" }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categroySchema)
