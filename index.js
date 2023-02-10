const express = require("express")
const app = express()

const port = process.env.PORT || 2503
app.listen(port, ()=>{console.log(`App is listening on ${port}`)})

const database = require("./database")
const Cuisine = require("./schema/cuisine")


app.get("/", (req, res)=>{
    res.send("Welcome !")
})

app.post("/api/cuisine/new", (req, res)=>{
    let cuisine = new Cuisine({
        name : req.body.name,
        desc : req.body.desc,
        status : req.body.status || "inactive",
    })
})