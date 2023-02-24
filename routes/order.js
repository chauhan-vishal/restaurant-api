const express = require("express")
const router = express.Router()

const Order = require("../schema/order")

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
 *                  employeeId : 
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
    Customer.findById(req.body.customerId)
        .then(customer => {
            Employee.findById(req.body.employeeId)
                .then(employee => {
                    Table.findById(req.body.tableId)
                        .then(async table => {

                            let orderItems = req.body.items

                            if (orderItems.length < 1) {
                                return res.send({ success: false, msg: "Order Items cannot be left blank.", document: null })
                            }

                            if (!(isValidOrder(orderItems))) {
                                return res.send({ success: false, msg: "Invalid Order Item", document: null })
                            }

                            let order = new Order({
                                "customerId": customer._id,
                                "employeeId": employee._id,
                                "tableId": table._id,
                                "orderDate": new Date(),
                                "items": orderItems,
                                "amount": req.body.amount
                            })

                            order.save()
                                .then(order => { return res.send({ success: true, msg: "order created", document: order }) })
                                .catch(err => { return res.send({ success: false, msg: "error occured", document: err.message }) })
                        })
                        .catch(err => { return res.send({ success: false, msg: "Table does not exist", document: err.message }) })
                })
                .catch(err => { return res.send({ success: false, msg: "Employee does not exist", document: err.message }) })
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

            if (req.body.employeeId && update) {
                await Employee.findById(req.body.employeeId)
                    .then(employee => {
                        order.employeeId = employee._id
                    })
                    .catch(err => {
                        update = false;
                        return res.send({ success: false, msg: "Employee does not exist", document: err.message })
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
                return res.send({ success: false, msg: "Order deleted", document: result })
            }
            else {
                return res.send({ success: false, msg: "Error occured ! " + err.message, document: result })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Order not found ! " + err.message, document: null }) })
})

module.exports = router