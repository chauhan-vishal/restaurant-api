const express = require("express")
const router = express.Router()

const Order = require("../schema/order")
const Customer = require("../schema/customer")
const Item = require("../schema/item")
const Table = require("../schema/table")


/**
 * @swagger
 * components :
 *      schema :
 *          Order :
 *              type : object
 *              properties :
 *                  orderId : 
 *                      type : string
 *                  customerId : 
 *                      type : string
 *                  tableId : 
 *                      type : string
 *                  items : 
 *                      type : array
 *                      items:  
 *                          properties :
 *                              itemId : 
 *                                  type : string
 *                              qty : 
 *                                  type : integer
 *                  amount : 
 *                      type : integer
 */

/**
 * @swagger
 * /api/order/:
 *  get:
 *      summary: This api is used to get all orde details
 *      description: This api is used to get all orde details
 *      responses : 
 *          200 : 
 *              description : All order details
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
 *                                      $ref : "#components/schema/Order" 
 */
router.get("/", (req, res) => {
    Order.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
        .populate("customerId", "name contact")
        .populate("tableId", "tableNo")
        .then(orders => { return res.send({ success: true, msg: "Order details found", document: orders }) })
        .catch(err => { return res.send({ success: false, msg: "Erorr Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/order/new:
 *  post:
 *      summary : This api is used to add a new order in database.
 *      description : This api is used to add a new order in database.
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Order"
 *      responses :
 *          200 : 
 *              description : Added Successfully       
 */
router.post("/new", async (req, res) => {
    Customer.findOne({ email: req.body.email })
        .then(customer => {
            Table.findOne({ tableNo: req.body.tableNo })
                .then(async table => {

                    let orderItems = req.body.items

                    // if (orderItems.length < 1) {
                    //     return res.send({ success: false, msg: "Order Items cannot be left blank.", document: null })
                    // }

                    // if (!(isValidOrder(orderItems))) {
                    //     return res.send({ success: false, msg: "Invalid Order Item", document: null })
                    // }

                    let order = new Order({
                        "customerId": customer._id,
                        "tableId": table._id,
                        "orderDate": new Date(),
                        "items": orderItems,
                        "desc": req.body.desc,
                        "qty": req.body.qty,
                        "amount": req.body.amount,
                        "orderStatus": "ordered"
                    })

                    order.save()
                        .then(order => { return res.send({ success: true, msg: "Order Placed!", document: order }) })
                        .catch(err => { return res.send({ success: false, msg: "error occured", document: err.message }) })
                })
                .catch(err => { return res.send({ success: false, msg: "Table does not exist", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Customer does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/order/update:
 *  put : 
 *      summary : This api is used to update order details in database
 *      description : This api is used to update order details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Order"
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
 *                                      $ref : "#components/schema/Order"
 *  */
router.put("/update", (req, res) => {
    Order.findById(req.body.orderId)
        .then(async order => {

            let update = true

            if (req.body.customerId) {
                await Customer.findById(req.body.customerId)
                    .then(customer => {
                        order.customerId = customer._id
                    })
                    .catch(err => {
                        update = false;
                        return res.send({ success: false, msg: "Customer does not exist", document: err.message })
                    })
            }

            if (req.body.tableId && update) {
                await Table.findById(req.body.tableId)
                    .then(table => {
                        order.tableId = table._id || order.tableId
                    })
                    .catch(err => {
                        update = false;
                        return res.send({ success: false, msg: "Table does not exist", document: err.message })
                    })
            }

            if (update) {
                let orderItems = req.body.items

                if (orderItems.length < 1) {
                    return res.send({ success: false, msg: "Order Items cannot be left blank.", document: null })
                }

                if (!(isValidOrder(orderItems))) {
                    return res.send({ success: false, msg: "Invalid Order Item", document: null })
                }

                order.items = orderItems
                order.amount = req.body.amount

                order.save()
                    .then(order => { return res.send({ success: true, msg: "Order Updated", document: order }) })
                    .catch(err => { return res.send({ success: false, msg: "Error occured !" + err.message, document: null }) })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Order not found", document: err.message }) })
})

function isValidOrder(items) {
    let result = true
    items.forEach(async item => {
        if (!("qty" in item) || !((mongoose.Types.ObjectId.isValid(item.itemId) && (await Item.findById(item.itemId))))) {
            result = false
        }
    })
    return result
}


/**
 * @swagger
 * /api/order/delete:
 *  delete:
 *      summary : This api is used to delete all orders from database
 *      description : This api is used to delete all orders from database
 *      responses:
 *          200:
 *              description : Deleted Successfully
 */
router.delete("/delete", (req, res) => {
    Order.deleteMany({})
        .then(result => { return res.send({ success: true, msg: "Orders deleted", document: result }) })
        .catch(err => { return res.send({ success: false, msg: "Error in deletion", document: err.message }) })
})

/**
 * @swagger
 * /api/order/delete/{id}:
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
router.delete("/delete/:orderId", (req, res) => {
    Order.findById(req.params.orderId)
        .then(async order => {
            let result = await order.delete()
            if (result) {
                return res.send({ success: true, msg: "Order deleted", document: result })
            }
            else {
                return res.send({ success: false, msg: "Error occured ! " + err.message, document: result })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Order not found ! " + err.message, document: null }) })
})


/**
 * @swagger
 * /api/order/update/status/{orderId}/{status}:
 *  put : 
 *      summary : This api is used to change the status of the item
 *      description : This api is used to change the status of the item
 *      parameters : 
 *          - in : path
 *            name : orderId
 *            required : true
 *            description : Order ID required
 *            schema : 
 *              type : string
 *          - in : path
 *            name : status
 *            required : true
 *            description : Order Status
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Status Changed
 *  */
router.put("/update/status/:orderId/:status", (req, res) => {
    console.log(req.params.status)
    Order.findById(req.params.orderId)
        .then(order => {
            order.orderStatus = req.params.status

            order.save()
                .then(order => { return res.send({ success: true, msg: "Order Status Updated !", document: order }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "order Does Not Exist !", document: err.message }) })
})


module.exports = router