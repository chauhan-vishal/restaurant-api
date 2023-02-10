const bodyParser = require("body-parser")
const express = require("express")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2503
app.listen(port, () => { console.log(`App is listening on ${port}`) })

const database = require("./database")
const Cuisine = require("./schema/cuisine")


app.get("/", (req, res) => {
    res.send("Welcome !")
})

app.post("/api/cuisine/new", (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    cuisine.save((err, cuisine)=>{
        if(err) return res.status(202).send({sucess: false, msg: "Error in creation!", document : null})
        else return res.send({sucess: true, document: cuisine, msg: "Success !"})
    })
})

app.get("/api/cuisine", (req, res)=>{
    let cuisines = Cuisine.find({}, (err, cuisines)=>{
        if(err) return res.status(202).send("Error Occured !")
        else return res.send(cuisines)
    })
})