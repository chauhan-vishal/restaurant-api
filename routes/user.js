const express = require("express")
const router = express.Router()

const User = require("../schema/user")
const UserRole = require("../schema/userrole")

/**
* @swagger
* components :
*      schema :
*          User:
*              type : object
*              properties :
*                  username : 
*                      type : string
*                      required : true
*                  password : 
*                      type : string
*                      required : true
*                  employeeId :
*                      type : string
*                  roleId:
*                      type : string
*                  status:
*                      type : string
*                  token:
*                      type : string
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
    User.find({}, { name: 1, username: 1, roleId: 1, status: 1 })
        .populate("employeeId", "name")
        .populate("roleId", "name")
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
        employeeId: req.body.employeeId,
        username: req.body.username,
        password: req.body.password,
        roleId: req.body.roleId,
        status: req.body.status
    })

    if (!await user.usernameExists()) {

        if (await user.usernameExists()) {
            return res.send({ success: false, msg: "User already exists", document: null })
        }

        await user.setPassword(req.body.password)
        user.setToken()

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
 *                          token :  
 *                              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.post("/login", (req, res) => {
    let role = req.body.role
    let username = req.body.username
    let password = req.body.password

    User.findOne({ username: username })
        .then(async user => {
            const roleExist = await UserRole.findOne({ name: role })
            if (!roleExist || roleExist._id.toString() != user.roleId.toString() || !await user.validPassword(password)) {
                return res.send({ success: false, msg: "Invalid credential !", document: null })
            }

            user.setToken(role.replace(" ", ""))
            user.save()

            return res.send({ success: true, msg: "Login Successfull !", document: { role: role, token: user.token } })
        })
        .catch(err => { console.log(err); return res.send({ success: false, msg: "User doesn't exist ! " + err.message, document: err.message }) })
})


/**
 * @swagger
 * /api/user/update/status/{id}:
 *  put : 
 *      summary : This api is used to change the status of the item
 *      description : This api is used to change the status of the item
 *      parameters : 
 *          - in : path
 *            name : departmentId
 *            required : true
 *            description : User ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Status Changed
 *  */
router.put("/update/status/:userId", (req, res) => {
    User.findById(req.params.userId)
        .then(user => {
            user.status = (user.status == "active") ? "inactive" : "active"

            user.save()
                .then(user => { return res.send({ success: true, msg: "User details updated !", document: user }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "user Does Not Exist !", document: err.message }) })
})

module.exports = router