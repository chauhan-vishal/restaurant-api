const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    name : {type : String, required : true},
    desc : String,
    status: {type : String, default : "inactive"},
    price : Number,
    qty : Number
},{
    timestamps : true
})

const Item = mongoose.model("Item", itemSchema)

module.exports = Item