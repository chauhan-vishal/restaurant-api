const mongoose = require("mongoose");

const categroySchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    cuisineId: mongoose.Schema.Types.ObjectId,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
});

const Category = mongoose.model("Category", categroySchema)

module.exports = Category