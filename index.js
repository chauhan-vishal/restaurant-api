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
const Department = require("./schema/department");
const Employee = require("./schema/employee")
const Order = require("./schema/order");
const Item = require("./schema/item");
const Table = require("./schema/table");
const Customer = require("./schema/customer");
const e = require("express");

// ====================================================================================================================================
// Swagger

const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Node JS API Project for Restaurant API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:2503/"
            }
        ]
    },
    apis: ['./index.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * components :
 *      schema :
 *          Category : 
 *              type : object
 *              properties :
 *                  categoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 * 
 *          Cuisine : 
 *              type : object
 *              properties :
 *                  cuisineId:
 *                      type : string
 *                  categoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 * 
 *          SubCategory:
 *              type : object
 *              properties :
 *                  subCategoryId:
 *                      type : string
 *                  cuisineId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 * 
 *          Item :
 *              type : object
 *              properties :
 *                  itemId:
 *                      type : string
 *                  subCategoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 *                  price :
 *                      type : integer
 *                  qty : 
 *                      type : integer
 * 
 *          Department :
 *              type : object
 *              properties :
 *                  departmentId :
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status :
 *                      type : string
 * 
 *          Employee:
 *              type : object
 *              properties : 
 *                  employeeId :
 *                      type : string
 *                  departmentId :
 *                      type : string
 *                  first :
 *                      type : string
 *                  last :
 *                      type : string
 *                  gender :
 *                      type : string
 *                  contact :
 *                      type : string
 *                  email :
 *                      type : string
 *                  street :
 *                      type : string
 *                  city :
 *                      type : string
 *                  state :
 *                      type : string
 *                  country :
 *                      type : string
 *                  pincode :
 *                      type : string
 *                  dob :
 *                      type : string
 *                  doj :
 *                      type : string
 *                  salary :
 *                      type : string
 *                  da :
 *                      type : string
 *                  bonus :
 *                      type : string
 * 
 * 
 *          Customer:
 *              type : object
 *              properties :
 *                  customerId :
 *                      type : string
 *                  first : 
 *                      type : string
 *                  last: 
 *                      type : string
 *                  email: 
 *                      type : string
 *                  contact: 
 *                      type : string
 *                  gender: 
 *                      type : string
 *                  dob: 
 *                      type : string
 *                  doa: 
 *                      type : string
 *                  status: 
 *                      type : string
 * 
 *          Table :
 *              type : object
 *              properties :
 *                  tableId :
 *                      type : string
 *                  tableNo : 
 *                      type : string
 *                  noOfSeat : 
 *                      type : string
 *                  status :
 *                      type : string
 */

// ====================================================================================================================================

/**
 * @swagger
 * /:
 *  get :
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description : To test Get method
 */
app.get("/", (req, res) => {
    res.send("Welcome !")
})


// Category
// ==================================================================================================================================
/**
 * @swagger
 * /api/category:
 *  get : 
 *      summary : To get all categories from database
 *      description : This api is used to fetch all categories data from database
 *      responses :
 *          200 : 
 *              description : This api is used to fetch all categories data from database
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              documents : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Category"
 *          202 : 
 *              description : This response is wrong
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              documents : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Category"
 *  */
app.get("/api/category", (req, res) => {
    Category.find({})
        .then(categories => { return res.send({ success: true, msg: "Data Found", document: categories }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/category/new:
 *  post : 
 *      summary : This api is used to add new category details in database
 *      description : This api is used to add new category details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Category"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/category/new", async (req, res) => {
    let category = new Category({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    if (!await category.exists()) {
        category.save()
            .then(category => { return res.send({ success: true, msg: "Category Created", document: category }) })
            .catch(err => { return res.status(202).send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.status(202).send({ success: false, msg: "Category already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/category/update:
 *  put : 
 *      summary : This api is used to update category details in database
 *      description : This api is used to updaet category details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Category"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *          202 :
 *              description : Error
 *  */
app.put("/api/category/update/", async (req, res) => {
    let categoryId = req.body.categoryId;
    Category.findById(categoryId)
        .then(async category => {

            let c = await Category.findOne({ name: req.body.name })

            if (c != null && c._id.toString() != category._id.toString()) {
                return res.status(202).send({ success: false, msg: "Category name already exists", document: null })
            }

            category.name = req.body.name || category.name
            category.desc = req.body.desc || category.desc
            category.status = req.body.status || category.status

            category.save()
                .then(category => { return res.send({ success: true, msg: "Category details updated !", document: category }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
})


/**
 * @swagger
 * /api/category/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/category/delete", (req, res) => {
    Category.deleteMany({})
        .then(categorys => {
            Cuisine.deleteMany({})
                .then(cuisine => {
                    SubCategory.deleteMany({})
                        .then(subCategories => {
                            Item.deleteMany({})
                                .then(items => { })
                                .catch(err => { return res.status(202).send({ success: false, msg: "Error in Item Deletion !", document: err.message }) })
                        })
                        .catch(err => { return res.status(202).send({ success: false, msg: "Error in Sub Category Deletion !", document: err.message }) })
                })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error in Cuisine Deletion !", document: err.message }) })
            return res.send({ success: true, msg: "Categorys deleted", document: categorys })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in Category Deletion !", document: err.message }) })
})


/**
 * @swagger
 * /api/category/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Category ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/category/delete/:categoryId", (req, res) => {
    Category.findById(req.params.categoryId)
        .then(async category => {
            deleteCuisineByCategoryId(category._id);

            let result = await category.delete();

            if (result) {
                res.send({ success: true, msg: "Category Deleted", document: result })
            }
            else {
                res.status(202).send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: null }) })
})


// Cuisine
// ==================================================================================================================================
/**
 * @swagger
 * /api/cuisine:
 *  get :
 *      summary : This api is used to get all cuisine details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from cuisine table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Cuisine" 
 * */
app.get("/api/cuisine", (req, res) => {
    Cuisine.find({})
        .then(cuisines => { return res.send({ success: true, msg: "Data Found", document: cuisines }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/cuisine/new:
 *  post : 
 *      summary : This api is used to add new cuisine details in database
 *      description : This api is used to add new cuisine details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Cuisine"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/cuisine/new", async (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
    })

    if (!await cuisine.exists()) {
        Category.findById(req.body.categoryId)
            .then(category => {
                cuisine.categoryId = category._id

                cuisine.save()
                    .then(c => { return res.send({ success: true, msg: "Cuisine Created", document: c }) })
                    .catch(err => { return res.status(202).send({ success: true, msg: "Error in creation", document: err.message }) })
            })
            .catch(err => { return res.status(202).send({ success: false, msg: "Category does not exists !", document: null }) })
    }
    else {
        return res.status(202).send({ success: false, msg: "Cuisine already exists !", document: null })
    }
})


/**
 * @swagger
 * /api/cuisine/update:
 *  put : 
 *      summary : This api is used to update cuisine details in database
 *      description : This api is used to updaet cuisine details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Cuisine"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Cuisine"
 *  */
app.put("/api/cuisine/update/", async (req, res) => {
    Cuisine.findById(req.body.cuisineId)
        .then(async cuisine => {
            let c = await Cuisine.findOne({ name: req.body.name })

            if (c != null && c._id.toString() != cuisine._id.toString()) {
                return res.send({ success: false, msg: "Cuisine name already exists", document: null })
            }

            if (req.body.categoryId) {
                Category.findById(req.body.categoryId)
                    .then(category => { cuisine.categoryId = category._id || cuisine.categoryId })
                    .catch(err => { return res.status(202).send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
            }

            cuisine.name = req.body.name || cuisine.name
            cuisine.desc = req.body.desc || cuisine.desc
            cuisine.status = req.body.status || cuisine.status

            cuisine.save()
                .then(c => { return res.send({ success: true, msg: "Cuisine details updated !", document: c }) })
                .catch(err => { console.log(err); return res.status(202).send({ success: false, msg: "Error in Updation", document: cuisine }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Cuisine Does Not Exist !", document: err.message }) })

})


/**
 * @swagger
 * /api/cuisine/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/cuisine/delete", (req, res) => {
    Cuisine.deleteMany({})
        .then(categories => { return res.send({ success: true, msg: "Categories Deleted !", document: categories }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in Deletion !", document: err.message }) })
})


/**
 * @swagger
 * /api/cuisine/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Cuisine ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/cuisine/delete/:cuisineId", async (req, res) => {

    Cuisine.findById(req.params.cuisineId)
        .then(cuisine => {
            deleteSubCategoryByCuisineId(cuisine._id)

            Cuisine.deleteOne({ _id: cuisine._id })
                .then(result => { return res.send({ success: true, msg: "Cuisine deleted", document: result }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error occured", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Cuisine does not exists", document: err.message }) })
})

async function deleteCuisineByCategoryId(categoryId) {
    let categories = await Cuisine.find({ categoryId: categoryId })

    categories.forEach(async cuisine => {
        cuisine.delete()
        await deleteSubCategoryByCuisineId(await cuisine.getId())
    });
}


// Sub Category
// ================================================================================================================================
/**
 * @swagger
 * /api/sub-category/:
 *  get :
 *      summary : This api is used to get all sub category details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from sub category table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/SubCategory" 
 * */
app.get("/api/sub-category/", (req, res) => {
    SubCategory.find({})
        .then(subCategories => { return res.send({ success: true, msg: "Data Found", document: subCategories }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error Occured", document: err.message }) })
})


/**
 * @swagger
 * /api/sub-category/new:
 *  post : 
 *      summary : This api is used to add new sub category details in database
 *      description : This api is used to add new sub category details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/SubCategory"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/sub-category/new", async (req, res) => {
    let subCategory = new SubCategory({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive"
    })

    if (!await subCategory.exists()) {

        Cuisine.findById(req.body.cuisineId)
            .then(cuisine => {
                subCategory.cuisineId = cuisine._id

                subCategory.save()
                    .then(subCategory => { return res.send({ success: true, msg: "Sub Category Created", document: subCategory }) })
                    .catch(err => { return res.status(202).send({ success: false, msg: "Error occured", document: err.message }) })
            })
            .catch(err => { return res.status(202).send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
    }
    else {
        return res.status(202).send({ success: false, msg: "Sub Category already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/sub-category/update:
 *  put : 
 *      summary : This api is used to update sub category details in database
 *      description : This api is used to update sub category details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/SubCategory"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/SubCategory"
 *  */
app.put("/api/sub-category/update/", (req, res) => {
    SubCategory.findById(req.body.subCategoryId)
        .then(async subCategory => {

            let subCategory2 = await SubCategory.findOne({ name: req.body.name })

            if (subCategory2 != null && subCategory2._id.toString() != subCategory._id.toString()) {
                return res.send({ success: false, msg: "Sub Category Name already exists", document: subCategory2 })
            }

            Cuisine.findById(req.body.cuisineId)
                .then(cuisine => {
                    subCategory.name = req.body.name || subCategory.name
                    subCategory.desc = req.body.desc || subCategory.desc
                    subCategory.cuisineId = cuisine._id || subCategory.categoryId;
                    subCategory.status = req.body.status || subCategory.status

                    subCategory.save()
                        .then(subCategory => { return res.send({ success: true, msg: "Sub Category Updated", document: subCategory }) })
                        .catch(err => { return res.status(202).send({ success: false, msg: "Error occured", document: err.message }) })
                })
                .catch(err => { return res.status(202).send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
})


/**
 * @swagger
 * /api/sub-category/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/sub-category/delete", (req, res) => {
    SubCategory.deleteMany({}, (err, subCategories) => {
        if (err) return res.status(202).send({ success: false, msg: "Error", document: subCategories })

        return res.send({ success: true, msg: "Deleted !", document: subCategories })
    })
})

/**
 * @swagger
 * /api/sub-category/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Sub Category ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/sub-category/delete/:subCategoryId", async (req, res) => {
    SubCategory.findById(req.params.subCategoryId)
        .then(subCategory => {
            deleteItemsBySubCategoryId(subCategory._id)

            subCategory.delete()
                .then(result => { return res.status(202).send({ success: true, msg: "Sub Category deleted", document: result }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
})

async function deleteSubCategoryByCuisineId(cuisineId) {
    let subCategories = await SubCategory.find({ cuisineId: cuisineId })

    subCategories.forEach(async subCategory => {
        subCategory.delete()
        await deleteItemsBySubCategoryId(subCategory._id)
    });
}


// item
// ==============================================================================================================================================
/**
 * @swagger
 * /api/item/:
 *  get :
 *      summary : This api is used to get all item details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from item table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Item" 
 * */
app.get("/api/item", (req, res) => {
    Item.find({})
        .then(item => { return res.send({ success: true, msg: "Data Found", document: item }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error !", document: item }) })
})

/**
 * @swagger
 * /api/item/new:
 *  post : 
 *      summary : This api is used to add new item details in database
 *      description : This api is used to add new item details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Item"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/item/new", async (req, res) => {
    let item = new Item({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive",
        price: req.body.price,
        qty: req.body.qty
    })

    if (!await item.exists()) {
        SubCategory.findById(req.body.subCategoryId)
            .then(subCategory => {
                item.subCategoryId = subCategory._id

                item.save()
                    .then(item => { res.send({ success: true, msg: "Item Created !", document: item }) })
                    .catch(err => { return res.status(202).send({ success: false, msg: "Error in creation !", document: err.message }) })
            })
            .catch(err => { return res.status(202).send({ success: false, msg: "Sub Category Does Not Exist !", document: err.message }) })
    }
    else {
        return res.status(202).send({ success: false, msg: "Item already exists", document: null })
    }
})

/**
 * @swagger
 * /api/item/update:
 *  put : 
 *      summary : This api is used to update item details in database
 *      description : This api is used to update item details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Item"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Item"
 *  */
app.put("/api/item/update/", (req, res) => {
    Item.findById(req.body.itemId)
        .then(async item => {

            let item2 = await Item.findOne({ name: req.body.name })

            if (item2 != null && item2._id.toString() != item._id.toString()) {
                return res.send({ success: false, msg: "Item name already exists", document: item2 })
            }

            if (req.body.subCategoryId) {
                SubCategory.findById(req.body.subCategoryId)
                    .then(subCategory => {
                        item.subCategoryId = subCategory._id
                    })
                    .catch(err => { return res.send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
            }
            
            item.name = req.body.name || item.name
            item.desc = req.body.desc || item.desc
            item.status = req.body.status || item.status

            item.save()
                .then(item => { return res.send({ success: true, msg: "Item details updated", document: item }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Update", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Item does not exist", document: err.message }) })
})


/**
 * @swagger
 * /api/item/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/item/delete", (req, res) => {
    Item.deleteMany()
        .then(result => { return res.send({ success: true, msg: "Items Deleted !", document: result }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error", document: err.message }) })
})


/**
 * @swagger
 * /api/item/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Item ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/item/delete/:itemId", (req, res) => {
    Item.findById(req.params.itemId)
        .then(async item => {
            let result = await item.delete()
            if (result) {
                return res.send({ success: true, msg: "Item deleted", document: result })
            }
            else {
                return res.send({ success: false, msg: "Error in deletion", document: result })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Item does not exists", document: err.message }) })
})

async function deleteItemsBySubCategoryId(subCategoryId) {
    await Item.deleteMany({ subCategoryId: subCategoryId })
}


// Department
// ==================================================================================================================
/**
 * @swagger
 * /api/department/:
 *  get :
 *      summary : This api is used to get all department details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from department table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Department" 
 * */
app.get("/api/department", (req, res) => {
    Department.find()
        .then(departments => { return res.send({ success: true, msg: "Data Found", document: departments }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Departments not found!", document: err.message }) })
})

/**
 * @swagger
 * /api/department/new:
 *  post : 
 *      summary : This api is used to add new department details in database
 *      description : This api is used to add new department details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Department"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/department/new", async (req, res) => {
    let department = new Department({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || "inactive"
    })

    if (!await department.exists()) {
        department.save()
            .then(dept => { return res.send({ success: true, msg: "Department Created !", document: dept }) })
            .catch(err => { return res.status(202).send({ success: false, msg: "Error in Creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Department already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/department/update:
 *  put : 
 *      summary : This api is used to update department details in database
 *      description : This api is used to update department details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Department"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Department"
 *  */
app.put("/api/department/update", async (req, res) => {
    Department.findById(req.body.departmentId)
        .then(async department => {
            let department2 = await Department.findOne({ name: new RegExp(req.body.name, "i") })

            if (department2 != null && department2._id.toString() != department._id.toString()) {
                return res.status(202).send({ success: false, msg: "Department name already exist", document: department2 })
            }

            department.name = req.body.name || department.name
            department.desc = req.body.desc || department.desc
            department.status = req.body.status || department.status

            department.save()
                .then(dept => { return res.send({ success: true, msg: "Department Updated !", document: dept }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error in Creation!", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Department does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/department/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/department/delete", (req, res) => {
    Department.deleteMany()
        .then(result => {
            Employee.deleteMany({})
            return res.send({ success: true, msg: "Departments Deleted !", document: result })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in Deletion!", document: err.message }) })
})

/**
 * @swagger
 * /api/department/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Department ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/department/delete/:departmentId", async (req, res) => {
    Department.findById(req.params.departmentId)
        .then(async department => {

            Employee.find({ departmentId: department._id })
                .then(employees => {
                    employees.forEach(emp => {
                        emp.delete()
                    })
                })
                .catch()

            let result = await department.delete()

            if (result) {
                return res.status(202).send({ success: true, msg: "Department deleted", document: result })
            }
            else {
                return res.status(202).send({ success: false, msg: "Error in deletion", document: result })
            }
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Department does not exist!", document: err.message }) })
})


// Employee
// =================================================================================================================================
/**
 * @swagger
 * /api/employee/:
 *  get :
 *      summary : This api is used to get all employee details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from employee table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Employee" 
 * */
app.get("/api/employee/", (req, res) => {
    Employee.find({})
        .then(emp => { return res.send({ success: true, msg: "Employee found", document: emp }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error Occred", document: err.msg }) })
})

/**
 * @swagger
 * /api/employee/new:
 *  post : 
 *      summary : This api is used to add new employee details in database
 *      description : This api is used to add new employee details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Employee"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/employee/new", async (req, res) => {
    let employee = new Employee({
        name: {
            first: req.body.first,
            last: req.body.last,
        },
        gender: req.body.gender,
        contact: req.body.contact,
        email: req.body.email,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode
        },
        dob: req.body.dob,
        doj: req.body.doj,
        salary: Number(req.body.salary),
        allowances: {
            da: Number(req.body.da),
            bonus: Number(req.body.bonus)
        }
    })

    if (!await employee.exists()) {
        Department.findById(req.body.departmentId)
            .then(department => {
                employee.departmentId = department._id

                employee.save()
                    .then(emp => { return res.send({ success: true, msg: "Employee created", document: emp }) })
                    .catch(err => { return res.status(202).send({ success: true, msg: "Error in creation", document: err.message }) })
            })
            .catch(err => { return res.status(202).send({ success: false, msg: "Department does not exists", document: err.message }) })
    } else {
        return res.status(202).send({ success: false, msg: "Employee already exists", document: null })
    }
})

/**
 * @swagger
 * /api/employee/update:
 *  put : 
 *      summary : This api is used to update employee details in database
 *      description : This api is used to update employee details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Employee"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Employee"
 *  */
app.put("/api/employee/update", async (req, res) => {
    Employee.findById(req.body.employeeId)
        .then(async employee => {

            let employee2 = await Employee.findOne({ email: req.body.email })

            if (employee2 != null && employee2._id.toString() != employee._id.toString()) {
                return res.status(202).send({ success: false, msg: "Employee Email already exist", document: employee2 })
            }

            if (req.body.departmentId) {
                Department.findById(req.body.departmentId)
                    .then(department => {
                        employee.departmentId = department._id
                    })
                    .catch(err => { return res.status(202).send({ success: false, msg: "Department does not exist", document: err.message }) })
            }
            employee.name.set("first", req.body.first || employee.name.get("first"))
            employee.name.set("last", req.body.last || employee.name.get("last"))
            employee.gender = req.body.gender || employee.gender
            employee.contact = req.body.contact || employee.contact
            employee.email = req.body.email || employee.email
            employee.address.street = req.body.street || employee.address.street
            employee.address.city = req.body.city || employee.address.city
            employee.address.state = req.body.state || employee.address.state
            employee.address.country = req.body.country || employee.address.country
            employee.address.pincode = req.body.pincode || employee.address.pincode
            employee.dob = req.body.dob || employee.dob
            employee.doj = req.body.doj || employee.doj
            employee.salary = Number(req.body.salary) || employee.salary
            employee.allowances.set("da", Number(req.body.da) || employee.allowances.get("da"))
            employee.allowances.set("bonus", Number(req.body.bonus) || employee.allowances.get("bonus"))

            employee.save()
                .then(employee => { return res.send({ success: true, msg: "Employee Updated", document: employee }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error in update", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Employee does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/employee/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/employee/delete", (req, res) => {
    Employee.deleteMany({})
        .then(emp => { return res.send({ success: true, msg: "Employees deleted", document: emp }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in deletion", document: err.message }) })
})

/**
 * @swagger
 * /api/employee/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Department ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/employee/delete/:name", async (req, res) => {
    let employee = new Employee({ email: req.params.name })

    if (await employee.exists()) {
        let result = await employee.delete()

        if (result) {
            return res.send({ success: true, msg: "Employee deleted", document: result })
        } else {
            return res.status(202).send({ success: false, msg: "Error", document: null })
        }
    } else {
        return res.status(202).send({ success: false, msg: "Employee does not exists", document: null })
    }
})


//Customer
//=============================================================================================================================================================================================================================
/**
 * @swagger
 * /api/customer/:
 *  get :
 *      summary : This api is used to get all customer details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from customer table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Customer" 
 * */
app.get("/api/customer", (req, res) => {
    Customer.find({})
        .then(table => { return res.status(202).send({ success: true, msg: "Data Found", document: table }) })
        .catch(err => { return res.send({ success: true, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/new:
 *  post : 
 *      summary : This api is used to add new customer details in database
 *      description : This api is used to add new customer details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Customer"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/customer/new", async (req, res) => {
    let customer = new Customer({
        name: {
            first: req.body.first,
            last: req.body.last
        },
        email: req.body.email,
        contact: req.body.contact,
        gender: req.body.gender,
        dates: {
            dob: req.body.dob,
            doa: req.body.doa
        },
        status: req.body.status || "inactive",
    })

    if (!await customer.exists()) {
        customer.save()
            .then(customer => { return res.send({ success: true, msg: "Customer added", document: customer }) })
            .catch(err => { return res.status(202).send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.status(202).send({ success: false, msg: "Customer already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/customer/update:
 *  put : 
 *      summary : This api is used to update customer details in database
 *      description : This api is used to update customer details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Customer"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Customer"
 *  */
app.put("/api/customer/update", (req, res) => {
    Customer.findById(req.body.customerId)
        .then(async customer => {

            let cust2 = Customer.findOne({ email: req.body.email })

            if (cust2 != null && cust2._id.toString() != customer._id.toString()) {
                return res.status(202).send({ success: false, msg: "Email already exists", document: null })
            }

            customer.name.set("first", req.body.first || customer.name.get("first"))
            customer.name.set("last", req.body.last || customer.name.get("last"))
            customer.email = req.body.email || customer.email
            customer.contact = req.body.contact || customer.contact
            customer.gender = req.body.gender || customer.gender
            customer.dates.set("dob", req.body.dob || customer.dates.get("dob"))
            customer.dates.set("doa", req.body.doa || customer.dates.get("doa"))
            customer.status = req.body.status || customer.status

            customer.save()
                .then(c => { return res.send({ success: true, msg: "Customer details updated", document: c }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error Occured", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Customer Does Not Exist !", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.delete("/api/customer/delete", (req, res) => {
    Customer.deleteMany({})
        .then(doc => { return res.send({ success: true, msg: "Deleted", document: doc }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in deletion", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Customer ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.get("/api/customer/delete/:customerId", (req, res) => {
    Customer.findById(req.params.customerId)
        .then(async customer => {
            let result = await customer.delete();

            if (result) {
                res.send({ success: true, msg: "Customer Deleted", document: result })
            }
            else {
                res.status(202).send({ success: false, msg: "Error in deletion", document: err.message })
            }
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Customer Does Not Exist !", document: err.message }) })
})


//Table
//===============================================================================================================================================================================================
/**
 * @swagger
 * /api/table/:
 *  get :
 *      summary : This api is used to get all table details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from table table
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Table" 
 * */
app.get("/api/table", (req, res) => {
    Table.find({})
        .then(table => { return res.send({ success: true, msg: "Data Found", document: table }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/table/new:
 *  post : 
 *      summary : This api is used to add new table details in database
 *      description : This api is used to add new table details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Table"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
app.post("/api/table/new", async (req, res) => {
    let table = new Table({
        tableNo: Number(req.body.tableNo),
        noOfSeat: Number(req.body.noOfSeat),
        status: req.body.status || "inactive",
    })

    if (!await table.exists()) {
        table.save()
            .then(table => { return res.send({ success: true, msg: "Table created", document: table }) })
            .catch(err => { return res.status(202).send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.status(202).send({ success: false, msg: "Table number already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/table/update:
 *  put : 
 *      summary : This api is used to update table details in database
 *      description : This api is used to update table details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Table"
 *      responses :
 *          200 : 
 *              description : Updated Successfully
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties :
 *                              success : 
 *                                  type : boolean
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items :
 *                                      $ref : "#components/schema/Table"
 *  */
app.put("/api/table/update/", async (req, res) => {
    Table.findById(req.body.tableId)
        .then(table => {
            table.noOfSeat = req.body.noOfSeat || table.noOfSeat
            table.status = req.body.status || table.status

            table.save()
                .then(tbl => { return res.status(202).send({ success: false, msg: "Table details updateds", document: tbl }) })
                .catch(err => { return res.status(202).send({ success: false, msg: "Error in update", document: err.message }) })
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Table does not exists", document: err.message }) })
})

/**
 * @swagger
 * /api/table/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.get("/api/table/delete", (req, res) => {
    Table.deleteMany({})
        .then(tables => { return res.send({ success: true, msg: "Tables deleted", document: tables }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error occured", document: err.message }) })
})

/**
 * @swagger
 * /api/table/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Table ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
app.get("/api/table/delete/:tableId", (req, res) => {
    Table.findById(req.params.tableId)
        .then(async table => {
            let result = await table.delete()

            if (result) {
                res.send({ success: true, msg: "Table Deleted", document: result })
            }
            else {
                res.status(202).send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { return res.status(202).send({ success: false, msg: "Table Does Not Exist !", document: err.message }) })
})


//orders
//==============================================================================================================================================================================
app.get("/api/order", (req, res) => {
    Order.find({})
        .then(orders => { return res.send({ success: true, msg: "Order details found", document: orders }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Erorr Occured", document: err.message }) })
})

app.post("/api/order/new", async (req, res) => {
    let customer = new Customer({})
    if (!await customer.exists()) {
        return res.status(202).send({ success: false, msg: "Customer Does Not Exist", document: null })
    }

    let employee = new Employee({})
    if (!await employee.exists()) {
        return res.status(202).send({ success: false, msg: "Employee Does Not Exist", document: null })
    }

    let table = new Table({})
    if (!await table.exists()) {
        return res.status(202).send({ success: false, msg: "Table Does Not Exist", document: null })
    }

    let amount = 0
    let orderItems = req.body.orderItems

    orderItems.forEach(item => {
        console.log(item)
    })
})

app.get("/api/order/delete", (req, res) => {
    Order.deleteMany({})
        .then(result => { return res.send({ success: true, msg: "Orders deleted", document: result }) })
        .catch(err => { return res.status(202).send({ success: false, msg: "Error in deletion", document: err.message }) })
})