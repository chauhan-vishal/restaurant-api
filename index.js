const bodyParser = require("body-parser")
const express = require("express")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2503
app.listen(port, () => { console.log(`App is listening on ${port}`) })

const database = require("./database")
const Cuisine = require("./schema/cuisine")
const Category = require("./schema/category")

app.get("/", (req, res) => {
    res.send("Welcome !")
})


// Cuisine
// ==================================================================================================================================

app.get("/api/cuisine", (req, res) => {
    let cuisines = Cuisine.find({}, (err, cuisines) => {
        if (err) return res.status(202).send("Error Occured !")
        else return res.send(cuisines)
    })
})

app.post("/api/cuisine/new", (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    cuisine.save((err, cuisine) => {
        if (err) return res.status(202).send({ sucess: false, msg: "Error in creation!", document: null })
        else return res.send({ sucess: true, document: cuisine, msg: "Success !" })
    })
})

// Category
// ==================================================================================================================================
app.post("/api/category/new", function (req, res) {
    let cuisineId = ""
    Cuisine.find({ name: req.body.cuisineName }, (err, cuisine) => {
        if (err) return res.status(202).send("Error Occured !")
        else {
            cuisineId = cuisine[0]._id

            let category = new Category({
                name: req.body.name,
                desc: req.body.desc,
                cuisineId: cuisineId,
                status: req.body.status || "inactive",
            })
        
            console.log("Category : ", category)
        
            category.save((err, category) => {
                if (err) return res.status(202).send({ sucess: false, msg: "Error in creation!", document: null })
                else res.send({ sucess: true, document: category, msg: "Success !" })
            })
        }
    })
})