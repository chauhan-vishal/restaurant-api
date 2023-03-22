const mongoose = require("mongoose")

const tableSchema = mongoose.Schema({
    tableNo: { type: Number, required: true },
    noOfSeat: { type: Number, required: true },
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
})

tableSchema.methods.exists = async function () {
    return await Table.count({ tableNo: this.tableNo }) == 1
}

tableSchema.methods.delete = async function () {
    return await Table.deleteOne({ _id: this._id })
}

const Table = mongoose.model("table", tableSchema)

module.exports = Table   