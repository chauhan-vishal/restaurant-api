const bodyParser = require("body-parser")
const express = require("express")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2503
app.listen(port, () => { console.log(`App is listening on ${port}`) })

const database = require("./database")

const mongoose = require("mongoose")

const CONSTANT = require("./constants")

// ====================================================================================================================================
// Swagger
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Node JS API Project for Restaurant API",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:2503/"
            }
        ]
    },
    apis: ['./index.js']
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @swagger
 * components :
 *      schema :
 *          Category : 
 *              type : object
 *              properties :
 *                  categoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 * 
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
 * 
 *          SubCategory:
 *              type : object
 *              properties :
 *                  subCategoryId:
 *                      type : string
 *                  cuisineId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 * 
 *          Item :
 *              type : object
 *              properties :
 *                  itemId:
 *                      type : string
 *                  subCategoryId:
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status : 
 *                      type : string
 *                  price :
 *                      type : integer
 *                  qty : 
 *                      type : integer
 * 
 *          Department :
 *              type : object
 *              properties :
 *                  departmentId :
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status :
 *                      type : string
 * 
 *          Employee:
 *              type : object
 *              properties : 
 *                  employeeId :
 *                      type : string
 *                  departmentId :
 *                      type : string
 *                  first :
 *                      type : string
 *                  last :
 *                      type : string
 *                  gender :
 *                      type : string
 *                  contact :
 *                      type : string
 *                  email :
 *                      type : string
 *                  street :
 *                      type : string
 *                  city :
 *                      type : string
 *                  state :
 *                      type : string
 *                  country :
 *                      type : string
 *                  pincode :
 *                      type : string
 *                  dob :
 *                      type : string
 *                  doj :
 *                      type : string
 *                  salary :
 *                      type : string
 *                  da :
 *                      type : string
 *                  bonus :
 *                      type : string
 * 
 * 
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
 * 
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
 * 
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
 * 
 *          User:
 *              type : object
 *              properties :
 *                  name : 
 *                      type : string
 *                  email : 
 *                      type : string
 *                  username : 
 *                      type : string
 */
// ====================================================================================================================================

/**
 * @swagger
 * /:
 *  get :
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses:
 *          200:
 *              description : To test Get method
 */
app.get("/", (req, res) => {
    res.send("Welcome !")
})


const category = require("./routes/category")
app.use("/api/category", category)

const cuisine = require("./routes/cuisine")
app.use("/api/cuisine", cuisine)

const subCategory = require("./routes/sub-category")
app.use("/api/sub-category", subCategory)

const item = require("./routes/item")
app.use("/api/item", item)

const department = require("./routes/department")
app.use("/api/department", department)

const employee = require("./routes/employee")
app.use("/api/employee", employee)

const customer = require("./routes/customer")
app.use("/api/customer", customer)

const table = require("./routes/table")
app.use("/api/table", table)

const order = require("./routes/order")
app.use("/api/order", order)

const user = require("./routes/user")
app.use("/api/user", user)