const express = require("express")
const router = express.Router()

const SubCategory = require("../schema/sub-category")

// Sub Category
// ================================================================================================================================
/**
 * @swagger
 * /:
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
router.get("/", (req, res) => {
    SubCategory.find({}, { _id: 1, name: 1, desc: 1, status: 1 })
        .then(subCategories => { return res.send({ success: true, msg: "Data Found", document: subCategories }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
})


/**
 * @swagger
 * /new:
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
router.post("/new", async (req, res) => {
    let subCategory = new SubCategory({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE
    })

    if (!await subCategory.exists()) {

        Cuisine.findById(req.body.cuisineId)
            .then(cuisine => {
                subCategory.cuisineId = cuisine._id

                subCategory.save()
                    .then(subCategory => { return res.send({ success: true, msg: "Sub Category Created", document: subCategory }) })
                    .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
    }
    else {
        return res.send({ success: false, msg: "Sub Category already exists !", document: null })
    }
})

/**
 * @swagger
 * /update:
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
router.put("/update/", (req, res) => {
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
                        .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
                })
                .catch(err => { return res.send({ success: false, msg: "Cuisine does not exist", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
})


/**
 * @swagger
 * /delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    SubCategory.deleteMany({}, (err, subCategories) => {
        if (err) return res.send({ success: false, msg: "Error", document: subCategories })

        return res.send({ success: true, msg: "Deleted !", document: subCategories })
    })
})

/**
 * @swagger
 * /delete/{id}:
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
router.delete("/delete/:subCategoryId", async (req, res) => {
    SubCategory.findById(req.params.subCategoryId)
        .then(subCategory => {
            deleteItemsBySubCategoryId(subCategory._id)

            subCategory.delete()
                .then(result => { return res.send({ success: true, msg: "Sub Category deleted", document: result }) })
                .catch(err => { return res.send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Sub Category does not exist", document: err.message }) })
})

async function deleteSubCategoryByCuisineId(cuisineId) {
    let subCategories = await SubCategory.find({ cuisineId: cuisineId })

    subCategories.forEach(async subCategory => {
        subCategory.delete()
        await deleteItemsBySubCategoryId(subCategory._id)
    });
}

module.exports = router