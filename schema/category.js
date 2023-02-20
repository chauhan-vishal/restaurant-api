const mongoose = require("mongoose");

const categroySchema = mongoose.Schema({
    name: { type: String, required: true },
    desc: String,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
});

categroySchema.methods.exists = async function (cName = this.name) {
    return await Category.count({ name: cName }) == 1;
}

categroySchema.methods.getId = async function () {
    return await Category.findOne({ name: this.name })
}

categroySchema.methods.delete = async function () {
    return await Category.deleteOne({ name: this.name })
}

const Category = mongoose.model("Category", categroySchema)

module.exports = Category                   