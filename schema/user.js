const crypto = require('crypto'); 
const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: {
        type: String,
        // required: true,
        validate: {
            validator: function (input) {
                var regex = /^[A-Za-z0-9]{7,12}$/
                return (!input || !input.trim().length) || regex.test(input)
            },
            message: 'Password validation failed! Does not match required pattern.  '
        }
    },
    hash: String,
    salt: String

})

userSchema.methods.usernameExists = async function () {
    return await User.count({ username: this.username }) == 1
}

userSchema.methods.emailExists = async function () {
    return await User.count({ email: this.email }) == 1
}

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
        1000, 64, `sha512`).toString(`hex`);
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password,
        this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

const User = mongoose.model("User", userSchema)
module.exports = User  