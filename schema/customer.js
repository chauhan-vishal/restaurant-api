const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const customerSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: String,
    gender: String,
    dates: Map,
    status: { type: String, default: process.env.STATUS_INACTIVE }
}, {
    timestamps: true
})

customerSchema.methods.exists = async function () {
    return await Customer.count({ email: this.email }) == 1
}

customerSchema.methods.setPassword = async function (password) {
    this.password = await bcrypt.hash(password, 10);
}

customerSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

customerSchema.methods.setToken = function () {
    const token = jwt.sign(
        { role: "Customer", user_id: this._id, email: this.email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    this.token = token;
};

const Customer = mongoose.model("Customer", customerSchema)

module.exports = Customer