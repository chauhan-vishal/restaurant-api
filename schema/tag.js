const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    name: { type: String, required: true },
    // desc: String,
    // img: String,
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
});

tagSchema.methods.exists = async function (tName = this.name) {
    return await Tag.count({ name: tName }) == 1;
}

tagSchema.methods.getId = async function () {
    return await Tag.findOne({ name: this.name })
}

tagSchema.methods.delete = async function () {
    return await Tag.deleteOne({ name: this.name })
}

const Tag = mongoose.model("Tag", tagSchema)

module.exports = Tag                   