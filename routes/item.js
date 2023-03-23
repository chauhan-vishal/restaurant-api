const express = require("express")
const router = express.Router()

const aws = require("../aws-s3")
const Item = require("../schema/item")
const Category = require("../schema/category")

/**
 * @swagger
 * components :
 *      schema :
 *          Item :
 *              type : object
 *              properties :
 *                  itemId:
 *                      type : string
 *                  categoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  img :
 *                      type : string
 *                  price :
 *                      type : integer
 *                  qty : 
 *                      type : integer
 *                  tags :
 *                      type : string
 *                  status : 
 *                      type : string
 */

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
router.get("/", (req, res) => {
    Item.find({}, { _id: 1, name: 1, desc: 1, price: 1, qty: 1, status: 1, img: 1 })
        .populate("categoryId", "name")
        .then(item => { return res.send({ success: true, msg: "Data Found", document: item }) })
        .catch(err => { return res.send({ success: false, msg: "Error !", document: err.message }) })
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
router.post("/new", async (req, res) => {

    const imgUrl = await aws.getImageURL(req.body.img, "Item")

    let item = new Item({
        name: req.body.name,
        desc: req.body.desc,
        img: imgUrl,
        price: req.body.price,
        qty: req.body.qty,
        tags: req.body.tags,
        status: req.body.status || process.env.STATUS_INACTIVE
    })

    if (!await item.exists()) {
        Category.findById(req.body.categoryId)
            .then(category => {
                item.categoryId = category._id

                item.save()
                    .then(item => { res.send({ success: true, msg: "Item Created !", document: item }) })
                    .catch(err => { return res.send({ success: false, msg: "Error in creation !", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Category Does Not Exist !", document: err.message }) })
    }
    else {
        return res.send({ success: false, msg: "Item already exists", document: null })
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
router.put("/update/", (req, res) => {
    Item.findById(req.body.itemId)
        .then(async item => {

            let item2 = await Item.findOne({ name: req.body.name })

            if (item2 != null && item2._id.toString() != item._id.toString()) {
                return res.send({ success: false, msg: "Item name already exists", document: item2 })
            }

            item.name = req.body.name || item.name
            item.desc = req.body.desc || item.desc
            item.status = req.body.status || item.status
            item.tags = req.body.tags || item.tags

            if (req.body.categoryId) {
                Category.findById(req.body.categoryId)
                    .then(category => {
                        item.categoryId = category._id
                    })
                    .catch(err => { return res.send({ success: false, msg: "Category does not exist", document: err.message }) })
            }

            if (req.body.img) {
                // await aws.deleteImageFromURL(item.img)
                item.img = await aws.getImageURL(req.body.img, "Item")
            }

            item.save()
                .then(item => { return res.send({ success: true, msg: "Item details updated", document: item }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Update", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Item does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/item/update/status/{id}:
 *  put : 
 *      summary : This api is used to change the status of the item
 *      description : This api is used to change the status of the item
 *      parameters : 
 *          - in : path
 *            name : itemId
 *            required : true
 *            description : Item ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Status Changed
 *  */
router.put("/update/status/:itemId", (req, res) => {
    Item.findById(req.params.itemId)
        .then(item => {
            item.status = (item.status == "active") ? "inactive" : "active"

            item.save()
                .then(item => { return res.send({ success: true, msg: "Item status changed !", document: item }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Item Does Not Exist !", document: err.message }) })
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
router.delete("/delete", (req, res) => {
    Item.deleteMany()
        .then(result => { return res.send({ success: true, msg: "Items Deleted !", document: result }) })
        .catch(err => { return res.send({ success: false, msg: "Error", document: err.message }) })
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
router.delete("/delete/:itemId", (req, res) => {
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

function deleteItemsByCategoryId(categoryId) {
    Item.deleteOne({ categoryId: categoryId })
        .then(items => { return res.send({ success: true, msg: "All items deleted for this category", document: items }) })
        .catch(err => { return res.send({ success: false, msg: "Items does not exist for this category", document: err.message }) })
}

module.exports = router
module.exports.deleteItemsByCategoryId = deleteItemsByCategoryId