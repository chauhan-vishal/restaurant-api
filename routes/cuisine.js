const express = require("express")
const router = express.Router()

const CONSTANT = require("../constants")

const Cuisine = require("../schema/cuisine")
const Category = require("../schema/category")
/**
 * @swagger
 * components :
 *      schema :
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
 */

/**
 * @swagger
 * /api/cuisine/:
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
router.get("/", (req, res) => {
    Cuisine.find({}, { _id: 1, name: 1, desc: 1, status: 1, categoryId: 1 })
        .populate("categoryId")
        .sort({ "createdAt": -1 })
        .then(cuisines => { return res.send({ success: true, msg: "Data Found", document: cuisines }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
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
router.post("/new", async (req, res) => {
    let cuisine = new Cuisine({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE,
    })

    if (!await cuisine.exists()) {
        Category.findById(req.body.categoryId)
            .then(category => {
                cuisine.categoryId = category._id

                cuisine.save()
                    .then(c => { return res.send({ success: true, msg: "Cuisine Created", document: c }) })
                    .catch(err => { return res.send({ success: true, msg: "Error in creation", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Category does not exists !", document: null }) })
    }
    else {
        return res.send({ success: false, msg: "Cuisine already exists !", document: null })
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
router.put("/update/", async (req, res) => {
    Cuisine.findById(req.body.cuisineId)
        .then(async cuisine => {
            let c = await Cuisine.findOne({ name: req.body.name })

            if (c != null && c._id.toString() != cuisine._id.toString()) {
                return res.send({ success: false, msg: "Cuisine name already exists", document: null })
            }

            if (req.body.categoryId) {
                Category.findById(req.body.categoryId)
                    .then(category => { cuisine.categoryId = category._id || cuisine.categoryId })
                    .catch(err => { return res.send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
            }

            cuisine.name = req.body.name || cuisine.name
            cuisine.desc = req.body.desc || cuisine.desc
            cuisine.status = req.body.status || cuisine.status

            cuisine.save()
                .then(c => { return res.send({ success: true, msg: "Cuisine details updated !", document: c }) })
                .catch(err => { console.log(err); return res.send({ success: false, msg: "Error in Updation", document: cuisine }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Cuisine Does Not Exist !", document: err.message }) })

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
router.delete("/delete", (req, res) => {
    Cuisine.deleteMany({})
        .then(categories => { return res.send({ success: true, msg: "Categories Deleted !", document: categories }) })
        .catch(err => { return res.send({ success: false, msg: "Error in Deletion !", document: err.message }) })
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
router.delete("/delete/:cuisineId", async (req, res) => {

    Cuisine.findById(req.params.cuisineId)
        .then(cuisine => {
            // deleteSubCategoryByCuisineId(cuisine._id)

            Cuisine.deleteOne({ _id: cuisine._id })
                .then(result => { return res.send({ success: true, msg: "Cuisine deleted", document: result }) })
                .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Cuisine does not exists", document: err.message }) })
})

module.exports = router