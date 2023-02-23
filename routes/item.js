const express = require("express")
const router = express.Router()

const Item = require("../schema/item")

// item
// ==============================================================================================================================================
/**
 * @swagger
 * /:
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
    Item.find({}, { _id: 1, name: 1, desc: 1, price: 1, qty: 1, status: 1 })
        .then(item => { return res.send({ success: true, msg: "Data Found", document: item }) })
        .catch(err => { return res.send({ success: false, msg: "Error !", document: item }) })
})

/**
 * @swagger
 * /new:
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
    let item = new Item({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE,
        price: req.body.price,
        qty: req.body.qty
    })

    if (!await item.exists()) {
        SubCategory.findById(req.body.subCategoryId)
            .then(subCategory => {
                item.subCategoryId = subCategory._id

                item.save()
                    .then(item => { res.send({ success: true, msg: "Item Created !", document: item }) })
                    .catch(err => { return res.send({ success: false, msg: "Error in creation !", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Sub Category Does Not Exist !", document: err.message }) })
    }
    else {
        return res.send({ success: false, msg: "Item already exists", document: null })
    }
})

/**
 * @swagger
 * /update:
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
        .catch(err => { return res.send({ success: false, msg: "Item does not exist", document: err.message }) })
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
    Item.deleteMany()
        .then(result => { return res.send({ success: true, msg: "Items Deleted !", document: result }) })
        .catch(err => { return res.send({ success: false, msg: "Error", document: err.message }) })
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

async function deleteItemsBySubCategoryId(subCategoryId) {
    await Item.deleteMany({ subCategoryId: subCategoryId })
}


module.exports = router