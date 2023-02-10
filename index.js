const express = require("express")
const app = express()

const port = process.env.PORT || 2503
app.listen(port, ()=>{console.log(`App is listening on ${port}`)})

const database = require("./database")
const category = require("./schema/category")
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

app.post("/api/categroy/new", function(req, res){
    cuisineId = ""
    Cuisine.find({name : req.body.cuisineName}, (err, cuisine)=>{
       if(err) 
       {
        return res.send("Cuisine Not Found")
       }
       else
       {
        cuisineId = cuisine._id 
       }
    })

    let categroy = new category({
        name : req.body.name,
        desc : req.body.desc,
        cuisineId : cuisineId,
        status: req.body.status || "inactive",
   }) 

})