const bodyParser = require("body-parser")
const express = require("express")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2503
app.listen(port, () => { console.log(`App is listening on ${port}`) })

const database = require("./database")
const Cuisine = require("./schema/cuisine")
const Category = require("./schema/category");
const category = require("./schema/category");
const SubCategory = require("./schema/sub-category");

app.get("/", (req, res) => {
    res.send("Welcome !")
})


// Cuisine
// ==================================================================================================================================

app.get("/api/cuisine", (req, res) => {
    let cuisines = Cuisine.find({}, (err, cuisines) => {
        if (err) return res.status(202).send("Error Occured !")
        else return res.send({ success: true, document: cuisines })
    })
})

app.post("/api/cuisine/new", (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    cuisine.save((err, cuisine) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in creation!", document: null })
        else return res.send({ success: true, document: cuisine, msg: "Success !" })
    })
})

app.get("/api/cuisine/delete", (req, res) => {
    Cuisine.deleteMany({}, (err, cuisines) => {

        if (err) {
            return res.status(202).send({ success: false, msg: "Error in Deletion !", document: cuisines })
        }
        else {
            Category.deleteMany({}, (err, categories) => {
                if (err) return res.status(202).send({ success: false, msg: "Erro in Category Deletion" })
            })
            return res.send({ success: true, msg: "Categories Deleted !", document: cuisines })
        }
    })
})

app.get("/api/cuisine/delete/:name", (req, res) => {
    let cuisineName = req.params.name

    Cuisine.find({ name: cuisineName }, (err, cuisine) => {

        if (err) return res.status(202).send({ success: false, msg: "Error in Cuisine deletion !" })

        if (cuisine.length < 1) return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !" })

        cuisineId = cuisine[0]._id

        Category.deleteMany({ cuisineId: cuisineId }, (err, categories) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in category deletion !" })
        })

        Cuisine.deleteOne({ name: cuisineName }, (err, cuisines) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Cuisine deletion !" })
            else {
                return res.send({ success: false, msg: "Cuisine Deleted !", document: cuisines })
            }
        })
    })
})


app.post("/api/cuisine/update/:name", (req, res) => {
    let cuisineName = req.params.name;

    Cuisine.find({ name: cuisineName }, (err, cuisine) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Updation!", document: null })
        else {

            if (cuisine.length < 1) return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !" })

            cuisine = cuisine[0]

            cuisine.name = req.body.name || cuisine.name
            cuisine.desc = req.body.desc || cuisine.desc
            cuisine.status = req.body.status || cuisine.status

            cuisine.save((err, cuisine) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in Updation", document: cuisine })
                else return res.send({ success: true, msg: "Cuisine details updated !", document: cuisine })
            })
        }
    })
})


// Category
// ==================================================================================================================================

app.get("/api/category", (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) return res.status(202).send("Error Occured !")
        else return res.send({ success: true, document: categories })
    })
})

app.post("/api/category/new", function (req, res) {
    let cuisineId = ""
    Cuisine.find({ name: req.body.cuisineName }, (err, cuisine) => {
        if (err) return res.status(202).send("Error Occured !")
        else {

            if (cuisine.length < 1) return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !" })

            cuisineId = cuisine[0]._id

            let category = new Category({
                name: req.body.name,
                desc: req.body.desc,
                cuisineId: cuisineId,
                status: req.body.status || "inactive",
            })

            category.save((err, category) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation!", document: null })
                else res.send({ success: true, document: category, msg: "Success !" })
            })
        }
    })
})

app.get("/api/category/delete", (req, res) => {
    Category.deleteMany({}, (err, categories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Deletion !", document: categories })
        else return res.send({ success: true, msg: "Categories Deleted !", document: categories })
    })
})

app.get("/api/category/delete/:name", (req, res) => {
    let categoryName = req.params.name

    Category.find({ name: categoryName }, (err, category) => {

        if (err) return res.status(202).send({ success: false, msg: "Error in category deletion !" })

        if (category.length < 1) return res.status(202).send({ success: false, msg: "Category Does Not Exist !" })

        categoryId = category[0]._id

        // SubCategory.deleteMany({cuisineId: cuisineId}, (err, categories)=>{
        //     if(err) return res.status(202).send({success : false, msg : "Error in category deletion !"})
        // })

        Category.deleteOne({ name: categoryName }, (err, category) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in category deletion !" })
            else {
                return res.send({ success: false, msg: "Category Deleted !", document: category })
            }
        })
    })
})

app.post("/api/category/update/:name", (req, res) => {
    let categoryName = req.params.name;

    Category.find({ name: categoryName }, (err, category) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Updation!", document: null })
        else {

            if (category.length < 1) return res.status(202).send({ success: false, msg: "Category Does Not Exist !" })

            category = category[0]

            category.name = req.body.name || category.name
            category.desc = req.body.desc || category.desc
            category.status = req.body.status || category.status

            category.save((err, category) => {
                if (err) { console.log(err); return res.status(202).send({ success: false, msg: "Error in Updation", document: category }) }
                else return res.send({ success: true, msg: "Category details updated !", document: category })
            })
        }
    })
})



// Sub Category
// ================================================================================================================================


app.get("/api/sub-category/", (req, res) => {
    SubCategory.find({}, (err, subCategories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error Occured", document: null })
        else return res.send({ success: true, msg: "Sub Categories Found !", document: subCategories })
    })
})

app.post("/api/sub-category/new", (req, res) => {

    let categoryName = req.body.categoryName

    Category.find({ name: categoryName }, (err, category) => {

        if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: category })
        else {

            if (category.length < 1) return res.status(202).send({ success: false, msg: "Error in creation !", document: category })

            categoryId = category[0]._id

            let subCategory = new SubCategory({
                name: req.body.name,
                desc: req.body.desc,
                status: req.body.status || "inactive",
                categoryId: categoryId
            })

            subCategory.save((err, category) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: category })
                return res.send({ success: true, msg: "Sub Category Created !", document: category })
            })
        }

    })
})

app.get("/api/sub-category/delete", (req, res) => {
    SubCategory.deleteMany({}, (err, subCategories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error", document: subCategories })

        return res.send({ success: true, msg: "Deleted !", document: subCategories })
    })
})

app.get("/api/sub-category/delete/:name", (req, res) => {
    let subCategoryName = req.params.name

    SubCategory.find({ name: subCategoryName }, (err, subCategory) => {

        if (err) return res.status(202).send({ success: false, msg: "Error", document: subCategory })

        if (subCategory.length < 1) return res.status(202).send({ success: false, msg: "Sub Category Does Not Exist !", document: subCategory })

        subCategoryId = subCategory[0]._id

        // Menuitem.deleteMany({subCategoryId : subCategoryId}, (err, item)=>{
        //     if(err) return res.status(202).send({success:false, msg: "Error in Item Deletion !", document: item})
        // })

        SubCategory.deleteOne({ name: subCategoryName }, (err, subCategory) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Sub Category Deletion !", document: subCategory })

            return res.send({ success: true, msg: "Sub Category Deleted !", document: subCategory })
        })
    })
})

app.post("/api/sub-category/update/:name", (req, res) => {
    let subCategoryName = req.params.name

    SubCategory.find({ name: subCategoryName }, (err, subCategory) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in update !", document: subCategory })

        if (subCategory.length < 1) return res.status(202).send({ success: true, msg: "Sub Category Does Not Exist !", document: subCategory })

        subCategory = subCategory[0]

        subCategory.name = req.body.name || subCategory.name
        subCategory.desc = req.body.desc || subCategory.desc
        subCategory.status = req.body.status || subCategory.status

        subCategory.save((err, subCategory) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Update !", document: subCategory })

            return res.send({ success: true, msg: "Sub Category Updated !", document: subCategory })
        })

    })
})



// item
// ==============================================================================================================================================

const Item = require("./schema/item")

app.get("/api/item", (req, res) => {
    Item.find({}, (err, item) => {
        if (err) return res.status(202).send({ success: false, msg: "Error !", document: item })

        return res.send({ success: true, msg: "item Found !", document: item })
    })
})

app.post("/api/item/new", (req, res) => {
    let subCategoryName = req.body.subCategoryName

    SubCategory.find({ name: subCategoryName }, (err, subCategory) => {

        if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: subCategory })
        else {

            if (subCategory.length < 1) return res.status(202).send({ success: false, msg: "Error in creation !", document: subCategory })

            subCategoryId = subCategory[0]._id

            let item = new Item({
                name: req.body.name,
                desc: req.body.desc,
                status: req.body.status || "inactive",
                subCategoryId: subCategoryId
            })

            item.save((err, item) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: item })
                return res.send({ success: true, msg: "Sub Category Created !", document: item })
            })
        }

    })
})

app.get("/api/item/delete", (req, res) => {
    Item.deleteMany({}, (err, items) => {
        if (err) return res.status(202).send({ success: false, msg: "Error", document: items })

        return res.send({ success: true, msg: "Deleted !", document: items })
    })
})

app.get("/api/item/delete/:name", (req, res) => {
    let itemName = req.params.name

    Item.find({ name: itemName }, (err, item) => {

        if (err) return res.status(202).send({ success: false, msg: "Error", document: Item })

        if (item.length < 1) return res.status(202).send({ success: false, msg: "Item Does Not Exist !", document: item })

        Item.deleteOne({ name: itemName }, (err, item) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Item Deletion !", document: item })

            return res.send({ success: true, msg: "Item Deleted !", document: item })
        })
    })
})

app.post("/api/item/update/:name", (req, res) => {
    let itemName = req.params.name

    Item.find({ name: itemName }, (err, item) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in update !", document: item })

        if (item.length < 1) return res.status(202).send({ success: true, msg: "Item Does Not Exist !", document: item })

        item = item[0]

        item.name = req.body.name || item.name
        item.desc = req.body.desc || item.desc
        item.status = req.body.status || item.status

        item.save((err, item) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Update !", document: item })

            return res.send({ success: true, msg: "Item Updated !", document: item })
        })

    })
})