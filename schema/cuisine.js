const mongoose = require("mongoose")

MONGO_URI = "mongodb+srv://admin:admin123@restaurant.uxazovj.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URI)

const db = mongoose.connection

db.on("error", (err) => console.error(err))
db.once("open", () => console.log("Connected to database !"))

const cuisineSchema = mongoose.Schema({
    name: { type: String, required: true },
    description : String,
    status: { type: String, default: "false" },
    created_at: { default: new Date(), immutable: true },
    updated_at: new Date()
})