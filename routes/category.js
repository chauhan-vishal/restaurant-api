const express = require("express")
const router = express.Router();
const aws = require("../aws-s3")

const CONSTANT = require("../constants")

const Category = require("../schema/category")

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
 */

/**
 * @swagger
 * /api/category/:
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
 *  */
router.get("/", (req, res) => {
    Category.find({}, { _id: 1, name: 1, desc: 1, img: 1, status: 1 })
        .sort({ "createdAt": -1 })
        .then(categories => { return res.send({ success: true, msg: "Data Found", document: categories }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
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
 *              multipart/form-data :
 *                  schema : 
 *                      $ref : "#components/schema/Category"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {

    let imgUrl = await aws.getImageURL(req.body.img, "Category")

    let category = new Category({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE,
        img: imgUrl
    })

    if (!await category.exists()) {
        category.save()
            .then(category => { return res.send({ success: true, msg: "Category Created", document: category }) })
            .catch(err => { return res.send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Category already exists !", document: null })
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
 *  */
router.put("/update/", async (req, res) => {
    let categoryId = req.body.categoryId;
    Category.findById(categoryId)
        .then(async category => {

            let c = await Category.findOne({ name: req.body.name })

            if (c != null && c._id.toString() != category._id.toString()) {
                return res.send({ success: false, msg: "Category name already exists", document: null })
            }

            category.name = req.body.name || category.name
            category.desc = req.body.desc || category.desc
            category.status = req.body.status || category.status

            category.save()
                .then(category => { return res.send({ success: true, msg: "Category details updated !", document: category }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
})

/**
 * @swagger
 * /api/category/update/status/{id}:
 *  put : 
 *      summary : This api is used to change the status of the item
 *      description : This api is used to change the status of the item
 *      parameters : 
 *          - in : path
 *            name : categoryId
 *            required : true
 *            description : Category ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Status Changed
 *  */
router.put("/update/status/:categoryId", (req, res) => {
    let categoryId = req.params.categoryId;
    Category.findById(categoryId)
        .then(category => {
            category.status = (category.status == "active") ? "inactive" : "active"

            category.save()
                .then(category => { return res.send({ success: true, msg: "Category details updated !", document: category }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
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
router.delete("/delete", (req, res) => {
    Category.deleteMany({})
        .then(categorys => {
            Cuisine.deleteMany({})
                .then(cuisine => {
                    SubCategory.deleteMany({})
                        .then(subCategories => {
                            Item.deleteMany({})
                                .then(items => { })
                                .catch(err => { return res.send({ success: false, msg: "Error in Item Deletion !", document: err.message }) })
                        })
                        .catch(err => { return res.send({ success: false, msg: "Error in Sub Category Deletion !", document: err.message }) })
                })
                .catch(err => { return res.send({ success: false, msg: "Error in Cuisine Deletion !", document: err.message }) })
            return res.send({ success: true, msg: "Categorys deleted", document: categorys })
        })
        .catch(err => { return res.send({ success: false, msg: "Error in Category Deletion !", document: err.message }) })
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
router.delete("/delete/:categoryId", (req, res) => {
    Category.findById(req.params.categoryId)
        .then(async category => {
            // deleteCuisineByCategoryId(category._id);

            let result = await category.delete();

            if (result) {
                res.send({ success: true, msg: "Category Deleted", document: result })
            }
            else {
                res.send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { res.send({ success: false, msg: "Category Does Not Exist !", document: null }) })
})

module.exports = router
