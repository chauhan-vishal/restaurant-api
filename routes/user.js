const express = require("express")
const router = express.Router()

const User = require("../schema/user")

/**
* @swagger
* components :
*      schema :
*          User:
*              type : object
*              properties :
*                  name : 
*                      type : string
*                      required : true
*                  email : 
*                      type : string
*                      required : true
*                  username : 
*                      type : string
*                      required : true
*                  password : 
*                      type : string
*                      required : true
*/

/**
 * @swagger
 * /api/user/:
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
 *                                      $ref : "#components/schema/User"
 */
router.get("/", (req, res) => {
    User.find({}, { name: 1, username: 1, email: 1 })
        .then(users => { return res.send({ success: true, msg: "User data", document: users }) })
        .catch(err => { return res.send({ success: false, msg: "Error occured ! " + err.message, document: null }) })
})

/**
 * @swagger
 * /api/user/new:
 *  post : 
 *      summary : This api is used to create/register new user.
 *      description : This api is used to create/register new user.
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/User"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
    })

    if (!await user.usernameExists()) {

        if (await user.emailExists()) {
            return res.send({ success: false, msg: "Email already exists", document: null })
        }

        user.setPassword(req.body.password)
        user.save()
            .then(user => { return res.send({ success: true, msg: "User data", document: user }) })
            .catch(err => { return res.send({ success: false, msg: "Error occured ! " + err.message, document: null }) })
    }
    else {
        return res.send({ success: false, msg: "Username already exist ! ", document: null })
    }
})

/**
 * @swagger
 * /api/user/delete:
 *  delete : 
 *      summary : This api is used to delete all users from database.
 *      description : This api is used to delete all users from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    User.deleteMany()
        .then(result => { return res.send({ success: true, msg: "User deleted", document: result }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured ! " + err.message, document: null }) })
})

/**
 * @swagger
 * /api/user/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : User ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete/:userId", (req, res) => {
    User.findById(req.params.userId)
        .then(async user => {
            let result = await user.delete()
            if (result) {
                return res.send({ success: true, msg: "User deleted ", document: result })
            }
            else {
                return res.send({ success: true, msg: "Error in deletion ", document: result })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "User not found ! " + err.message, document: null }) })
})

/**
 * @swagger
 * /api/user/login:
 *  post : 
 *      summary : This api is used to log in user with ID & Password.
 *      description : This api is used to log in user with ID & Password.
 *      requestBody:
 *          required : true
 *          content :
 *              application/json:
 *                  schema :
 *                      type : object
 *                      properties :
 *                          username : 
 *                              type : string
 *                              required : true
 *                          password :  
 *                              type : string
 *                              required : true
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password

    User.findOne({ username: username })
        .then(user => {
            if (user.validPassword(password)) {
                return res.send({ success: true, msg: "Login Successfull !", document: null })
            }
            else {
                return res.send({ success: false, msg: "Invalid credential !", document: null })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "User doesn't exist ! " + err.message, document: null }) })
})

module.exports = router