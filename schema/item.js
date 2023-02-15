const mongoose = require("mongoose")

const itemSchema = mongoose.Schema({
    name : {type : String, required : true},
    desc : String,
    subCategoryId : mongoose.Schema.Types.ObjectId,
    status: {type : String, default : "inactive"},
    price : Number,
    qty : Number
},{
    timestamps : true
})

itemSchema.methods.exists = async function (cName = this.name) {
    return await Item.count({ name: cName }) == 1;
}

itemSchema.methods.getId = async function(){
    return await Item.findOne({name : this.name})
}

itemSchema.methods.delete = async function(){
    return await Item.deleteOne({name : this.name})
}

const Item = mongoose.model("Item", itemSchema)

module.exports = Item