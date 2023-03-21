const express = require("express")
const router = express.Router()

const Role = require("../schema/role")

/**
* @swagger
* components :
*      schema :
*          Role:
*              type : object
*              properties :
*                  rolename : 
*                      type : string
*                      required : true
*                  roledesc : 
*                      type : string
*                      required : true
*                   status : 
 *                      type : string
*/

/**
 * @swagger
 * /api/role/:
 *  get:
 *      summary : This api will get all the roles data
 *      description : This api will get all the roles data
 *      responses : 
 *          200 :
 *              description : This api will get all the roles data
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
 *                                      $ref : "#components/schema/Role"
 */
router.get("/", (req, res) => {
    Role.find({}, { rolename: 1, roledesc: 1 })
        .then(roles => { return res.send({ success: true, msg: "Role data", document: roles }) })
        .catch(err => { return res.send({ success: false, msg: "Error occured ! " + err.message, document: null }) })
})

/**
 * @swagger
 * /api/role/new:
 *  post : 
 *      summary : This api is used to create/register new role.
 *      description : This api is used to create/register new role.
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Role"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {
    let role = new Role({
        rolename: req.body.rolename,
        roledesc: req.body.roledesc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE,

    })

    if (!await role.rolenameExists()) {

        if (await role.rolenameExists()) {
            return res.send({ success: false, msg: "Email already exists", document: null })
        }

       

        role.save()
            .then(role => { return res.send({ success: true, msg: "role data", document: role }) })
            .catch(err => { return res.send({ success: false, msg: "Error occured ! " + err.message, document: null }) })
    }
    else {
        return res.send({ success: false, msg: "Role is  already exist ! ", document: null })
    }
})

/**
 * swagger
 * /api/role/delete:
 *  delete : 
 *      summary : This api is used to delete all roles from database.
 *      description : This api is used to delete all roles from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
// router.delete("/delete", (req, res) => {
//     Role.deleteMany()
//         .then(result => { return res.send({ success: true, msg: "Role deleted", document: result }) })
//         .catch(err => { return res.send({ success: false, msg: "Error Occured ! " + err.message, document: null }) })
// })

/**
 * swagger
 * /api/role/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Role ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
// router.delete("/delete/:roleId", (req, res) => {
//     Role.findById(req.params.roleId)
//         .then(async role => {
//             let result = await role.delete()
//             if (result) {
//                 return res.send({ success: true, msg: "Role deleted ", document: result })
//             }
//             else {
//                 return res.send({ success: true, msg: "Error in deletion ", document: result })
//             }
//         })
//         .catch(err => { return res.send({ success: false, msg: "Role not found ! " + err.message, document: null }) })
// })

/**
 * swagger
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
// router.post("/login", (req, res) => {
//     let username = req.body.username
//     let password = req.body.password

//     User.findOne({ username: username })
//         .then(async user => {
//             if (await user.validPassword(password)) {
//                 user.setToken()
//                 user.save()

//                 return res.send({ success: true, msg: "Login Successfull !", document: user })
//             }
//             else {
//                 return res.send({ success: false, msg: "Invalid credential !", document: null })
//             }
//         })
//         .catch(err => { return res.send({ success: false, msg: "User doesn't exist ! " + err.message, document: null }) })
// })

module.exports = router
