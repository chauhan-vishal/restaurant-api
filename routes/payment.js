const express = require("express")
const router = express.Router()

const Payment = require("../schema/payment")

/**
* @swagger
* components :
*      schema :
*          Payment:
*              type : object
*              properties :
*                  orderId : 
*                      type : string
*                      required : true
*                  billNo : 
*                      type : string
*                      required : true
*                  discount : 
*                      type : number
*                  tax : 
*                      type : number
*                  amount : 
*                      type : number
*                      required : true
*                  method : 
*                      type : string
*                      required : true
*/

/**
 * @swagger
 * /api/payment/:
 *  get:
 *      summary : This api will get all the users data
 *      description : This api will get all the users data
 *      responses : 
 *          200 :
 *              description : This api will get all the users data
 *              content : 
 *                  application/json :
 *                      schema : 
 *                          type : object
 *                          properties: 
 *                              success : 
 *                                  type : string
 *                              msg : 
 *                                  type : string
 *                              document : 
 *                                  type : array
 *                                  items : 
 *                                      $ref : "#components/schema/Payment"
 */
router.get("/", (req, res) => {
    Payment.find({}, { _id: 0, createdAt: 0, updatedAt: 0 })
        .then(payments => { return res.send({ success: true, msg: "Data Found", document: payments }) })
        .catch(err => { return res.send({ success: false, msg: "No Payments ! " + err.message, document: null }) })
})

router.post("/new", (req, res) => {
    let payment = new Payment({
        orderId: req.body.orderId,
        billNo: req.body.billNo,
        discount: req.body.discount,
        tax: req.body.tax,
        amount: req.body.amount,
        method: req.body.method
    })

    payment.save()
        .then(payment => { return res.send({ success: true, msg: "Payment done !", document: payment }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured ! " + err.message, document: null }) })
})

module.exports = router