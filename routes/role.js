const express = require("express")
const Role = require("../schema/userrole")
const router = express.Router()


/**
 * @swagger
 * components :
 *      schema :
 *          Role :
 *              type : object
 *              properties :
 *                  roleId :
 *                      type : string
 *                  name : 
 *                      type : string
 *                  desc : 
 *                      type : string
 *                  status :
 *                      type : string
 */

/**
 * @swagger
 * /api/role/:
 *  get :
 *      summary : This api is used to get all role details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from role role
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
 *                                      $ref : "#components/schema/Role" 
 * */
router.get("/", (req, res) => {
    Role.find({}, { __v: 0, createdAt: 0, updatedAt: 0 })
        .then(role => { return res.send({ success: true, msg: "Data Found", document: role }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occured", document: err.message }) })
})

/**
 * @swagger
 * /api/role/new:
 *  post : 
 *      summary : This api is used to add new role details in database
 *      description : This api is used to add new role details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/role"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {

    let role = new      
    Role({
        name: req.body.name,
        desc: req.body.desc,
        status: (req.body.status == true) ? process.env.STATUS_ACTIVE : process.env.STATUS_INACTIVE
    })

    if (!await role.exists()) {
        role.save()
            .then(role => { return res.send({ success: true, msg: "Role created", document: role }) })
            .catch(err => { return res.send({ success: false, msg: "Error in creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Role number already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/role/update:
 *  put : 
 *      summary : This api is used to update role details in database
 *      description : This api is used to update role details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Role"
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
 *                                      $ref : "#components/schema/Role"
 *  */
router.put("/update/", async (req, res) => {
    Role.findById(req.body.roleId)
        .then(async role => {

            let role2 = await Role.findOne({ name: req.body.name })

            if (role2 != null && role2._id.toString() != role._id.toString()) {
                return res.send({ success: false, msg: "Role name  Already Exists !", document: null })
            }

            role.name = req.body.name || role.name
            role.desc = req.body.desc || role.noOfSeat
            role.status = req.body.status || role.status

            role.save()
                .then(tbl => { return res.send({ success: true, msg: "Role details updateds", document: tbl }) })
                .catch(err => { return res.send({ success: false, msg: "Error in update", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Role does not exists", document: err.message }) })
})


/**
 * @swagger
 * /api/role/update/status/{id}:
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
router.put("/update/status/:roleId", (req, res) => {
    Role.findById(req.params.roleId)
        .then(role => {
            role.status = (role.status == "active") ? "inactive" : "active"

            role.save()
                .then(role => { return res.send({ success: true, msg: "Role details updated !", document: role }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Role Does Not Exist !", document: err.message }) })
})


/**
 * @swagger
 * /api/role/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    Role.deleteMany({})
        .then(roles => { return res.send({ success: true, msg: "Roles deleted", document: roles }) })
        .catch(err => { return res.send({ success: false, msg: "Error occured", document: err.message }) })
})

/**
 * @swagger
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
router.delete("/delete/:roleId", (req, res) => {
    Role.findById(req.params.roleId)
        .then(async role => {
            let result = await role.delete()

            if (result) {
                res.send({ success: true, msg: "Role Deleted", document: result })
            }
            else {
                res.send({ success: false, msg: "Error in deletion", document: null })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Role Does Not Exist !", document: err.message }) })
})

module.exports = router