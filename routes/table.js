const express = require("express")
const router = express.Router()

const Table = require("../schema/table")

/**
 * @swagger
 * components :
 *      schema :
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
router.get("/", (req, res) => {
    Table.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
        .then(table => { return res.send({ success: true, msg: "Data Found", document: table }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
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
router.post("/new", async (req, res) => {
    let table = new Table({
        tableNo: Number(req.body.tableNo),
        noOfSeat: Number(req.body.noOfSeat),
        status: req.body.status || process.env.STATUS_INACTIVE,
    })

    if (!await table.exists()) {
        table.save()
            .then(table => { return res.send({ success: true, msg: "Table created", document: table }) })
            .catch(err => { return res.send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Table number already exists !", document: null })
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
router.put("/update/", async (req, res) => {
    Table.findById(req.body.tableId)
        .then(async table => {

            let table2 = await Table.findOne({ tableNo: req.body.tableNo })

            if (table2 != null && table2._id.toString() != table._id.toString()) {
                return res.send({ success: false, msg: "Table No Already Exists !", document: null })
            }

            table.tableNo = req.body.tableNo || table.tableNo
            table.noOfSeat = req.body.noOfSeat || table.noOfSeat
            table.status = req.body.status || table.status

            table.save()
                .then(tbl => { return res.send({ success: true, msg: "Table details updateds", document: tbl }) })
                .catch(err => { return res.send({ success: false, msg: "Error in update", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Table does not exists", document: err.message }) })
})


/**
 * @swagger
 * /api/table/update/status/{id}:
 *  put : 
 *      summary : This api is used to change the status of the item
 *      description : This api is used to change the status of the item
 *      parameters : 
 *          - in : path
 *            name : departmentId
 *            required : true
 *            description : Category ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Status Changed
 *  */
router.put("/update/status/:customerId", (req, res) => {
    Table.findById(req.params.customerId)
        .then(table => {
            table.status = (table.status == "active") ? "inactive" : "active"

            table.save()
                .then(category => { return res.send({ success: true, msg: "Table details updated !", document: table }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Table Does Not Exist !", document: err.message }) })
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
router.delete("/delete", (req, res) => {
    Table.deleteMany({})
        .then(tables => { return res.send({ success: true, msg: "Tables deleted", document: tables }) })
        .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
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
router.delete("/delete/:tableId", (req, res) => {
    Table.findById(req.params.tableId)
        .then(async table => {
            let result = await table.delete()

            if (result) {
                res.send({ success: true, msg: "Table Deleted", document: result })
            }
            else {
                res.send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Table Does Not Exist !", document: err.message }) })
})

module.exports = router