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
const SubCategory = require("./schema/sub-category");

app.get("/", (req, res) => {
    res.send("Welcome !")
})


// Cuisine
// ==================================================================================================================================
app.get("/api/cuisine", (req, res) => {
    let cuisines = Cuisine.find({}, (err, cuisines) => {
        if (err) return res.status(202).send({ success: false, msg: "Error Occured", document: null })
        else return res.send({ success: true, msg: "Data Found", document: cuisines })
    })
})

app.post("/api/cuisine/new", async (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    if (! await cuisine.exists()) {
        cuisine.save((err, cuisine) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in creation!", document: null })
            else return res.send({ success: true, msg: "Success !", document: cuisine })
        })
    } else {
        return res.status(202).send({ success: false, msg: "Cuisine already exists !", document: null })
    }
})

app.get("/api/cuisine/delete", (req, res) => {

    Cuisine.deleteMany({}, (err, cuisines) => {
        if (err) {
            return res.status(202).send({ success: false, msg: "Error in Deletion !", document: cuisines })
        }
        else {
            Category.deleteMany({}, (err, categories) => {
                if (err) return res.status(202).send({ success: false, msg: "Erro in Category Deletion" })
                else {
                    SubCategory.deleteMany({}, (err, subcategories) => {
                        if (err) return res.status(200).send({ success: false, msg: "Error in Sub Category Deletion !" })
                        else {
                            Item.deleteMany({}, (err, items) => {
                                if (err) return res.status(200).send({ success: false, msg: "Error in Item Deletion !" })
                            })
                        }
                    })
                }
            })
            return res.send({ success: true, msg: "Categories Deleted !", document: cuisines })
        }
    })

})

app.get("/api/cuisine/delete/:name", async (req, res) => {

    let cuisine = new Cuisine({ name: req.params.name })

    if (await cuisine.exists()) {
        console.log("Cuisine ID : " +  await cuisine.getId())
        deleteCategoryByCuisineId(await cuisine.getId());

        // let result = await cuisine.delete();
        let result = null;

        if (result) {
            res.send({ success: true, msg: "Cuisine Deleted", document: result })
        }
        else {
            res.status(202).send({ success: false, msg: "Error in deletion", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !", document: null })
    }
})

app.post("/api/cuisine/update/:name", async (req, res) => {
    let cuisineName = req.params.name;

    if (await new Cuisine({ name: cuisineName }).exists()) {
        Cuisine.findOne({ name: cuisineName }, (err, cuisine) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Updation!", document: null })

            cuisine.name = req.body.name || cuisine.name
            cuisine.desc = req.body.desc || cuisine.desc
            cuisine.status = req.body.status || cuisine.status

            cuisine.save((err, cuisine) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in Updation", document: cuisine })
                else return res.send({ success: true, msg: "Cuisine details updated !", document: cuisine })
            })
        })
    }
    else {
        return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !" })
    }
})


// Category
// ==================================================================================================================================
app.get("/api/category", (req, res) => {
    Category.find({}, (err, categories) => {
        if (err) return res.status(202).send("Error Occured !")
        else return res.send({ success: true, msg: "Data Found", document: categories })
    })
})

app.post("/api/category/new", async (req, res) => {
    let category = new Category({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    if (!await category.exists()) {
        if (await new Cuisine({ name: req.body.cuisineName }).exists()) {
            let cuisineId = await Cuisine.findOne({ name: req.body.cuisineName });

            category.cuisineId = cuisineId

            category.save((err, category) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation!", document: null })
                else res.send({ success: true, document: category, msg: "Success !" })
            })
        }
        else {
            return res.status(202).send({ success: false, msg: "Cuisine does not exists !", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Category already exists !", document: null })
    }
})

app.post("/api/category/update/:name", async (req, res) => {
    let categoryName = req.params.name;
    let cuisineName = req.body.cuisineName;

    if (await new Category({ name: categoryName }).exists()) {
        let cuisine = new Cuisine({ name: cuisineName });

        if (await cuisine.exists() || cuisineName == null) {
            Category.findOne({ name: categoryName }, async (err, category) => {
                category.name = req.body.name || category.name
                category.desc = req.body.desc || category.desc
                category.cuisineId = (cuisineName != null) ? await cuisine.getId() : category.cuisineId
                category.status = req.body.status || category.status

                category.save((err, category) => {
                    if (err) { console.log(err); return res.status(202).send({ success: false, msg: "Error in Updation", document: category }) }
                    else return res.send({ success: true, msg: "Category details updated !", document: category })
                })
            })
        }
        else {
            return res.status(202).send({ success: false, msg: "Cuisine Does Not exists !", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: null })
    }
})

app.get("/api/category/delete", (req, res) => {
    Category.deleteMany({}, (err, categories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Deletion !", document: categories })
        else return res.send({ success: true, msg: "Categories Deleted !", document: categories })
    })
})

app.get("/api/category/delete/:name", async (req, res) => {
    let category = new Category({ name: req.params.name })

    if (await category.exists()) {

        deleteSubCategoryByCategoryId(await category.getId())

        let result = await category.delete()

        if (result) {
            return res.status(202).send({ success: true, msg: "Category Deleted", document: result })
        }
        else {
            return res.status(202).send({ success: false, msg: "Error in Deletion", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: null })
    }
})

function deleteAllCategory() {
    Category.deleteMany({}, (err, categories) => {
        if (err) return false
        else return true
    })
}

async function deleteCategoryByCuisineId(cuisineId) {
    let categories = await Category.find({ cuisineId: cuisineId })

    categories.forEach(async category => {
        category.delete()
        await deleteSubCategoryByCategoryId(await category.getId())
    });
}



// Sub Category
// ================================================================================================================================
app.get("/api/sub-category/", (req, res) => {
    SubCategory.find({}, (err, subCategories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error Occured", document: null })
        else return res.send({ success: true, msg: "Data Found", document: subCategories })
    })
})

app.post("/api/sub-category/new", async (req, res) => {

    let subCategory = new SubCategory({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive"
    })

    if (!await subCategory.exists()) {

        let category = new Category({ name: req.body.categoryName });

        if (await category.exists()) {

            subCategory.categoryId = await category.getId()

            subCategory.save((err, category) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: category })
                return res.send({ success: true, msg: "Sub Category Created !", document: category })
            })
        }
        else {
            return res.status(202).send({ success: false, msg: "Category does not exist", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Sub Category already exists !", document: null })
    }
})

app.post("/api/sub-category/update/:name", async (req, res) => {

    let categoryName = req.body.categoryName;

    if (await new SubCategory({ name: req.params.name }).exists()) {

        let category = new Category({ name: categoryName })

        if (await category.exists() || category.name == null) {

            SubCategory.findOne({ name: req.params.name }, async (err, subCategory) => {
                subCategory.name = req.body.name || subCategory.name
                subCategory.desc = req.body.desc || subCategory.desc
                subCategory.categoryId = (categoryName != null) ? await category.getId() : subCategory.categoryId;
                subCategory.status = req.body.status || subCategory.status

                subCategory.save((err, subCategory) => {
                    if (err) return res.status(202).send({ success: false, msg: "Error in Update", document: null })

                    return res.send({ success: true, msg: "Sub Category Updated", document: subCategory })
                })
            })

        }
        else {
            return res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Sub Category Does Not Exist !", document: null })
    }

})

app.get("/api/sub-category/delete", (req, res) => {
    SubCategory.deleteMany({}, (err, subCategories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error", document: subCategories })

        return res.send({ success: true, msg: "Deleted !", document: subCategories })
    })
})

app.get("/api/sub-category/delete/:name", async (req, res) => {
    let subCategory = new SubCategory({ name: req.params.name })

    if (await subCategory.exists()) {

        deleteItemsBySubCategoryId(await subCategory.getId())

        let result = await subCategory.delete()

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


async function deleteSubCategoryByCategoryId(categoryId) {
    let subCategories = await SubCategory.find({ categoryId : categoryId })

    subCategories.forEach(async subCategory => {
        subCategory.delete()
        await deleteItemsBySubCategoryId(await subCategory.getId())
    });
}



// item
// ==============================================================================================================================================

const Item = require("./schema/item")

app.get("/api/item", (req, res) => {
    Item.find({}, (err, item) => {
        if (err) return res.status(202).send({ success: false, msg: "Error !", document: item })

        return res.send({ success: true, msg: "Data Found", document: item })
    })
})

app.post("/api/item/new", async (req, res) => {
    let item = new Item({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    if (!await item.exists()) {

        let subCategory = new SubCategory({ name: req.body.subCategoryName })

        if (await subCategory.exists()) {

            item.subCategoryId = await subCategory.getId()

            item.save((err, item) => {
                if (err) return res.status(202).send({ success: false, msg: "Error in creation !", document: item })
                return res.send({ success: true, msg: "Sub Category Created !", document: item })
            })
        }
        else {
            return res.status(202).send({ success: false, msg: "Sub Category Does Not Exist !", document: null })
        }

    }
    else {
        return res.status(202).send({ success: false, msg: "Item already exists", document: null })
    }
})

app.post("/api/item/update/:name", async (req, res) => {

    let subCategoryName = req.body.subCategoryName;

    if (await new Item({ name: req.params.name }).exists()) {

        let subCategory = new SubCategory({ name: subCategoryName })

        if (await subCategory.exists() || subCategory.name == null) {

            Item.findOne({ name: req.params.name }, async (err, item) => {
                item.name = req.body.name || item.name
                item.desc = req.body.desc || item.desc
                item.subCategoryId = (subCategory != null) ? await subCategory.getId() : item.subCategoryId;
                item.status = req.body.status || item.status

                item.save((err, item) => {
                    if (err) return res.status(202).send({ success: false, msg: "Error in Update", document: null })

                    return res.send({ success: true, msg: "Item Updated", document: item })
                })
            })

        }
        else {
            return res.status(202).send({ success: false, msg: "Sub Category Does Not Exist !", document: null })
        }
    }
    else {
        return res.status(202).send({ success: false, msg: "Item Does Not Exist !", document: null })
    }
})

app.get("/api/item/delete", (req, res) => {
    Item.deleteMany({}, (err, items) => {
        if (err) return res.status(202).send({ success: false, msg: "Error", document: items })

        return res.send({ success: true, msg: "Deleted !", document: items })
    })
})

app.get("/api/item/delete/:name", async (req, res) => {
    let item = new Item({ name: req.params.name })

    if (await item.exists()) {
        let result = await item.delete()

        if (result) {
            return res.status(202).send({ success: true, msg: "Item deleted", document: result })
        }
        else {
            return res.status(202).send({ success: false, msg: "Error in deletion", document: null })
        }
    } else {
        return res.status(202).send({ success: false, msg: "Item Does Not Exist !", document: null })
    }
})

async function deleteItemsBySubCategoryId(subCategoryId) {
    await SubCategory.deleteMany({ subCategoryId: subCategoryId })
}


// Department
// ==================================================================================================================
const Department = require("./schema/department");


app.get("/api/department", (req, res) => {
    Department.find({}, (err, departments) => {
        if (err) return res.status(202).send({ success: false, msg: "Departments not found!" })
        else return res.send({ success: true, msg: "Data Found", document: departments })
    })
})

app.post("/api/department/new", (req, res) => {
    let department = new Department({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive"
    })

    department.save((err, department) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Creation!" })
        else return res.send({ success: true, msg: "Department Created !", document: department })
    })
})

app.get("/api/department/delete", (req, res) => {
    Department.deleteMany({}, (err, departments) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Deletion!" })
        else return res.send({ success: true, msg: "Departments Deleted !", document: departments })
    })
})

app.get("/api/department/delete/:name", (req, res) => {
    let departmentName = req.params.name

    Department.findOne({ name: new RegExp(departmentName, "i") }, (err, department) => {
        if (err) return res.status(202).send({ success: false, msg: "Error in Deletion!" })

        if (err) return res.status(202).send({ success: false, msg: "Error in Customer deletion !" })

        let departmentId = department._id

        //Employee.deleteMany({departmentId : departmentId}, (err, employees)=>{
        // if (err) return res.status(202).send({ success: false, msg: "Error in Employee Deletion!" })
        // })

        Department.deleteOne({ name: departmentName }, (err, department) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Updation!" })
            return res.send({ success: true, msg: "Department Deleted !", document: department })
        })
    })


    app.post("/api/customer/update/:name", (req, res) => {
        let customerName = req.params.name;
    
        Customer.find({ name: customerName }, (err, customer) => {
            if (err) return res.status(202).send({ success: false, msg: "Error in Updation!", document: null })
            else {
    
                if (customer.length < 1) return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !" })
    
                customer = customer[0]
    
                customer.name = req.body.name || customer.name
                customer.email = req.body.email || customer.email
                customer.contact = req.body.contact || customer.contact
                customer.gender = req.body.gender || customer.gender
                customer.dates = req.body.dates || customer.dates
                customer.status = req.body.status || customer.status
    
                customer.save((err, customer) => {
                    if (err) return res.status(202).send({ success: false, msg: "Error in Updation", document: customer })
                    else return res.send({ success: true, msg: "Customer details updated !", document: customer })
                })
            }
        })

    })
