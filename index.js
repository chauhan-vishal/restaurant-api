const CONSTANT = require("./constants")
const bodyParser = require("body-parser")
const express = require("express")
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 2503
app.listen(port, () => { console.log(`App is listening on ${port}`) })

const database = require("./database")
database.connect()


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
    apis: [
        './index.js',
        './routes/category.js',
        './routes/cuisine.js',
        './routes/sub-category.js',
        './routes/item.js',
        './routes/department.js',
        './routes/employee.js',
        './routes/customer.js',
        './routes/table.js',
        './routes/order.js',
        './routes/user.js',
    ]
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

const auth = require("./middleware/auth");
// User Authorization for all requests
app.use(auth, (req, res, next) => {
    next()
})


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