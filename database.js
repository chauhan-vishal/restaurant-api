const mongoose = require("mongoose")

function connect() {
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_URI)

    const db = mongoose.connection

    db.on("error", (err) => console.error(err))
    db.once("open", () => console.log("Connected to database !"))
}

module.exports.connect = connect