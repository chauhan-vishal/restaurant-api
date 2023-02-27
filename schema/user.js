const bcrypt = require('bcrypt');
const mongoose = require("mongoose")
const CONSTANTS = require("../constants")
const jwt = require("jsonwebtoken")

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required : true },
    token: { type: String },

})

userSchema.methods.usernameExists = async function () {
    return await User.count({ username: this.username }) == 1
}

userSchema.methods.emailExists = async function () {
    return await User.count({ email: this.email }) == 1
}

userSchema.methods.setToken = function () {
    const token = jwt.sign(
        { user_id: this._id, email: this.email },
        CONSTANTS.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
    this.token = token;
};

userSchema.methods.setPassword = async function (password) {
    this.password = await bcrypt.hash(password, 10);
}

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema)
module.exports = User  