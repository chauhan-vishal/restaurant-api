const mongoose = require("mongoose")

const tableSchema = mongoose.Schema({
   tableNo: String,
   noSeat:Number,
    status: { type: String, default: "inactive" }
}, {
    timestamps: true
})

const Table = mongoose.model("table", tableSchema )

module.exports = Table   