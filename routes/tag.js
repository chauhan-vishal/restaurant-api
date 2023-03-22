const express = require("express")
const router = express.Router();
const aws = require("../aws-s3")

const Tag = require("../schema/tag")

/**
 * @swagger
 * components :
 *      schema :
 *          Tag : 
 *              type : object
 *              properties :
 *                  tagId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                 
 *                  status : 
 *                      type : string
 */

/**
 * @swagger
 * /api/tag/:
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
    Tag.find({}, { _id: 1, name: 1, status: 1 })
        .sort({ "createdAt": -1 })
        .then(tags => { return res.send({ success: true, msg: "Data Found", document: tags }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
})


/**
 * @swagger
 * /api/tag/new:
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

    // let imgUrl = await aws.getImageURL(req.body.img, "Category")

    let tag = new Tag({
        name: req.body.name,
        // desc: req.body.desc,
        status: (req.body.status) ? process.env.STATUS_ACTIVE : process.env.STATUS_INACTIVE,
        // img: imgUrl
    })

    if (!await tag.exists()) {
        tag.save()
            .then(tag => { return res.send({ success: true, msg: "Tag Created", document: tag }) })
            .catch(err => { return res.send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Tag already exists !", document: null })
    }
})


/**
 * @swagger
 * /api/tag/update:
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
    let tagId = req.body.tagId;

    Tag.findById(tagId)
        .then(async tag => {

            let c = await Tag.findOne({ name: req.body.name })

            if (c != null && c._id.toString() != tag._id.toString()) {
                return res.send({ success: false, msg: "Tag name already exists", document: null })
            }

            // if (req.body.img) {
            //     // await aws.deleteImageFromURL(category.img)
            //     category.img = await aws.getImageURL(req.body.img, "Category")
            // }

            tag.name = req.body.name || tag.name
            // category.desc = req.body.desc || category.desc
            tag.status = req.body.status || tag.status

            tag.save()
                .then(tag => { return res.send({ success: true, msg: "Tag details updated !", document: tag }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Tag Does Not Exist !", document: err.message }) })
})

/**
 * @swagger
 * /api/tag/update/status/{id}:
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
router.put("/update/status/:tagId", (req, res) => {
    let tagId = req.params.tagId;
    Tag.findById(tagId)
        .then(tag => {
            tag.status = (tag.status == "active") ? "inactive" : "active"

            tag.save()
                .then(tag => { return res.send({ success: true, msg: "Tag details updated !", document: tag }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Tag Does Not Exist !", document: err.message }) })
})


/**
 * @swagger
 * /api/tag/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    Tag.deleteMany({})
        .then(tag => {
             return res.send({ success: true, msg: "Tags deleted", document: tag })
        })
        .catch(err => { return res.send({ success: false, msg: "Error in Category Deletion !", document: err.message }) })
})


/**
 * @swagger
 * /api/tag/delete/{id}:
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
router.delete("/delete/:tagId", (req, res) => {
    Tag.findById(req.params.tagId)
        .then(async tag => {
            // deleteCuisineByCategoryId(category._id);

            // await aws.deleteImageFromURL(category.img);
            let result = await tag.delete();

            if (result) {
                res.send({ success: true, msg: "Tag Deleted", document: result })
            }
            else {
                res.send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { res.send({ success: false, msg: "Tag Does Not Exist !", document: err.message }) })
})

module.exports = router
