const mongoose = require("mongoose")

const userroleSchema = mongoose.Schema({
    name: String,
    desc: String,
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
})

userroleSchema.methods.exists = async function () {
    return await UserRole.count({ name: this.name }) == 1
}

userroleSchema.methods.delete = async function () {
    return await UserRole.deleteOne({ _id: this._id })
}

const UserRole = mongoose.model("UserRole", userroleSchema)

module.exports = UserRole