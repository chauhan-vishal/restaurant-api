const CONSTANT = require("./constants")
const bodyParser = require("body-parser")
const express = require("express")
const multer = require("multer")
const cors = require("cors")
const upload = multer({ dest: "upload/" })
const app = express()

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array())

app.use(cors())

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
        './routes/payment.js',
        './routes/role.js',

    ]
}

const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    next()
})

const auth = require("./middleware/auth");
// User Authorization for all requests
app.use(auth, (req, res, next) => {
    next()
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

const payment = require("./routes/payment");
const Category = require("./schema/category");
app.use("/api/payment", payment)

const role = require("./routes/role")
app.use("/api/role", role)


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