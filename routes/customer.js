const express = require("express")
const router = express.Router()

const Customer = require("../schema/customer")

/**
 * @swagger
 * components :
 *      schema :
 *          Customer:
 *              type : object
 *              properties :
 *                  customerId :
 *                      type : string
 *                  first : 
 *                      type : string
 *                  last: 
 *                      type : string
 *                  email: 
 *                      type : string
 *                  contact: 
 *                      type : string
 *                  gender: 
 *                      type : string
 *                  dob: 
 *                      type : string
 *                  doa: 
 *                      type : string
 *                  status: 
 *                      type : string
 */

/**
 * @swagger
 * /api/customer/:
 *  get :
 *      summary : This api is used to get all customer details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from customer table
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
 *                                      $ref : "#components/schema/Customer" 
 * */
router.get("/", (req, res) => {
    Customer.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
        .then(table => { return res.send({ success: true, msg: "Data Found", document: table }) })
        .catch(err => { return res.send({ success: true, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/new:
 *  post : 
 *      summary : This api is used to add new customer details in database
 *      description : This api is used to add new customer details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Customer"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {
    let customer = new Customer({
        name: {
            first: req.body.first,
            last: req.body.last
        },
        email: req.body.email,
        contact: req.body.contact,
        gender: req.body.gender,
        dates: {
            dob: req.body.dob,
            doa: req.body.doa
        },
        status: req.body.status || CONSTANT.STATUS_INACTIVE,
    })

    if (!await customer.exists()) {
        customer.save()
            .then(customer => { return res.send({ success: true, msg: "Customer added", document: customer }) })
            .catch(err => { return res.send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Customer already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/customer/update:
 *  put : 
 *      summary : This api is used to update customer details in database
 *      description : This api is used to update customer details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Customer"
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
 *                                      $ref : "#components/schema/Customer"
 *  */
router.put("/update", (req, res) => {
    Customer.findById(req.body.customerId)
        .then(async customer => {

            let cust2 = Customer.findOne({ email: req.body.email })

            if (cust2 != null && cust2._id.toString() != customer._id.toString()) {
                return res.send({ success: false, msg: "Email already exists", document: null })
            }

            customer.name.set("first", req.body.first || customer.name.get("first"))
            customer.name.set("last", req.body.last || customer.name.get("last"))
            customer.email = req.body.email || customer.email
            customer.contact = req.body.contact || customer.contact
            customer.gender = req.body.gender || customer.gender
            customer.dates.set("dob", req.body.dob || customer.dates.get("dob"))
            customer.dates.set("doa", req.body.doa || customer.dates.get("doa"))
            customer.status = req.body.status || customer.status

            customer.save()
                .then(c => { return res.send({ success: true, msg: "Customer details updated", document: c }) })
                .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Customer Does Not Exist !", document: err.message }) })
})


/**
 * @swagger
 * /api/customer/update/status/{id}:
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
    Customer.findById(req.params.customerId)
        .then(customer => {
            customer.status = (customer.status == "active") ? "inactive" : "active"

            customer.save()
                .then(category => { return res.send({ success: true, msg: "Customer details updated !", document: customer }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Customer Does Not Exist !", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    Customer.deleteMany({})
        .then(doc => { return res.send({ success: true, msg: "Deleted", document: doc }) })
        .catch(err => { return res.send({ success: false, msg: "Error in deletion", document: err.message }) })
})

/**
 * @swagger
 * /api/customer/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Customer ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete/:customerId", (req, res) => {
    Customer.findById(req.params.customerId)
        .then(async customer => {
            let result = await customer.delete();

            if (result) {
                res.send({ success: true, msg: "Customer Deleted", document: result })
            }
            else {
                res.send({ success: false, msg: "Error in deletion", document: err.message })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Customer Does Not Exist !", document: err.message }) })
})

module.exports = router