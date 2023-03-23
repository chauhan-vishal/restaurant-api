const express = require("express")
const router = express.Router()

const aws = require("../aws-s3")

const Category = require("../schema/category")
const Cuisine = require("../schema/cuisine")

/**
 * @swagger
 * components :
 *      schema :
 *          Category:
 *              type : object
 *              properties :
 *                  categoryId:
 *                      type : string
 *                  cuisineId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  img :
 *                      type : string
 *                  status : 
 *                      type : string
 */

/**
 * @swagger
 * /api/category/:
 *  get :
 *      summary : This api is used to get all  category details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from  category table
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
 *                                      $ref : "#components/schema/Category" 
 * */
router.get("/", (req, res) => {
    Category.find({}, { _id: 1, name: 1, desc: 1, status: 1, img: 1 })
        .populate("cuisineId", "name")
        .then(categories => { return res.send({ success: true, msg: "Data Found", document: categories }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
})


/**
 * @swagger
 * /api/category/new:
 *  post : 
 *      summary : This api is used to add new  category details in database
 *      description : This api is used to add new  category details in database
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
router.post("/new", async (req, res) => {

    const imgUrl = await aws.getImageURL(req.body.img, "Category")

    let category = new Category({
        name: req.body.name,
        desc: req.body.desc,
        img: imgUrl,
        status: req.body.status || process.env.STATUS_INACTIVE
    })

    if (!await category.exists()) {

        Cuisine.findById(req.body.cuisineId)
            .then(cuisine => {
                category.cuisineId = cuisine._id

                category.save()
                    .then(category => { return res.send({ success: true, msg: "Category Created", document: category }) })
                    .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
    }
    else {
        return res.send({ success: false, msg: "Category already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/category/update:
 *  put : 
 *      summary : This api is used to update  category details in database
 *      description : This api is used to update  category details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Category"
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
 *                                      $ref : "#components/schema/Category"
 *  */
router.put("/update/", (req, res) => {
    Category.findById(req.body.categoryId)
        .then(async category => {

            let category2 = await Category.findOne({ name: req.body.name })

            if (category2 != null && category2._id.toString() != category._id.toString()) {
                return res.send({ success: false, msg: "Category Name already exists", document: category2 })
            }

            Cuisine.findById(req.body.cuisineId)
                .then(async cuisine => {
                    category.name = req.body.name || category.name
                    category.desc = req.body.desc || category.desc
                    category.cuisineId = cuisine._id || category.categoryId;
                    category.status = req.body.status || category.status

                    if (req.body.img) {
                        // await aws.deleteImageFromURL(category.img);
                        category.img = await aws.getImageURL(req.body.img, "Category")
                    }

                    category.save()
                        .then(category => { return res.send({ success: true, msg: "Category Updated", document: category }) })
                        .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
                })
                .catch(err => { return res.send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Category does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/category/update/status/{id}:
 *  put : 
 *      summary : This api is used to change the status of the category
 *      description : This api is used to change the status of the category
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
    Category.findById(req.params.categoryId)
        .then(category => {
            category.status = (category.status == "active") ? "inactive" : "active"

            category.save()
                .then(category => { return res.send({ success: true, msg: "Cuisine details updated !", document: category }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Cuisine Does Not Exist !", document: err.message }) })
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
        .then(categories => { return res.send({ success: true, msg: "Categories Deleted", document: categories }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured!", document: err.message }) });
})

/**
 * @swagger
 * /api/category/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : categoryId
 *            required : true
 *            description : Category ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete/:categoryId", async (req, res) => {
    Category.findById(req.params.categoryId)
        .then(category => {
            // deleteItemsBySubCategoryId(category._id)

            category.delete()
                .then(result => { return res.send({ success: true, msg: "Category deleted", document: result }) })
                .catch(err => { return res.send({ success: false, msg: "Category does not exist", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Category does not exist", document: err.message }) })
})

// async function deleteSubCategoryByCuisineId(cuisineId) {
//     let subCategories = await Category.find({ cuisineId: cuisineId })

//     subCategories.forEach(async subCategory => {
//         subCategory.delete()
//         await deleteItemsBySubCategoryId(subCategory._id)
//     });
// }

module.exports = router