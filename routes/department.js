const express = require("express")
const router = express.Router()

const Department = require("../schema/department")

/**
 * @swagger
 * components :
 *      schema :
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
 */

/**
 * @swagger
 * /api/department/:
 *  get :
 *      summary : This api is used to get all department details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from department table
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
 *                                      $ref : "#components/schema/Department" 
 * */
router.get("/", (req, res) => {
    Department.find({}, { _id: 1, name: 1, desc: 1, status: 1 })
        .then(departments => { return res.send({ success: true, msg: "Data Found", document: departments }) })
        .catch(err => { return res.send({ success: false, msg: "Departments not found!", document: err.message }) })
})

/**
 * @swagger
 * /api/department/new:
 *  post : 
 *      summary : This api is used to add new department details in database
 *      description : This api is used to add new department details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Department"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {
    let department = new Department({
        name: req.body.name,
        desc: req.body.desc,
        status: req.body.status || CONSTANT.STATUS_INACTIVE
    })

    if (!await department.exists()) {
        department.save()
            .then(dept => { return res.send({ success: true, msg: "Department Created !", document: dept }) })
            .catch(err => { return res.send({ success: false, msg: "Error in Creation!", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Department already exists !", document: null })
    }
})

/**
 * @swagger
 * /api/department/update:
 *  put : 
 *      summary : This api is used to update department details in database
 *      description : This api is used to update department details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Department"
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
 *                                      $ref : "#components/schema/Department"
 *  */
router.put("/update", async (req, res) => {
    Department.findById(req.body.departmentId)
        .then(async department => {
            let department2 = await Department.findOne({ name: new RegExp(req.body.name, "i") })

            if (department2 != null && department2._id.toString() != department._id.toString()) {
                return res.send({ success: false, msg: "Department name already exist", document: department2 })
            }

            department.name = req.body.name || department.name
            department.desc = req.body.desc || department.desc
            department.status = req.body.status || department.status

            department.save()
                .then(dept => { return res.send({ success: true, msg: "Department Updated !", document: dept }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Creation!", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Department does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/department/update/status/{id}:
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
router.put("/update/status/:departmentId", (req, res) => {
    Department.findById(req.params.departmentId)
        .then(department => {
            department.status = (department.status == "active") ? "inactive" : "active"

            department.save()
                .then(category => { return res.send({ success: true, msg: "Department details updated !", document: department }) })
                .catch(err => { return res.send({ success: false, msg: "Error in Updation", document: err.message }) })
        })
        .catch(err => { return res.send({ success: false, msg: "Department Does Not Exist !", document: err.message }) })
})

/**
 * @swagger
 * /api/department/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    Department.deleteMany()
        .then(result => {
            Employee.deleteMany({})
            return res.send({ success: true, msg: "Departments Deleted !", document: result })
        })
        .catch(err => { return res.send({ success: false, msg: "Error in Deletion!", document: err.message }) })
})

/**
 * @swagger
 * /api/department/delete/{id}:
 *  delete : 
 *      summary : This api is used to delete document with given ID from database.
 *      description : This api is used to delete document with given ID from database.
 *      parameters : 
 *          - in : path
 *            name : id
 *            required : true
 *            description : Department ID required
 *            schema : 
 *              type : string
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete/:departmentId", async (req, res) => {
    Department.findById(req.params.departmentId)
        .then(async department => {

            // Employee.find({ departmentId: department._id })
            //     .then(employees => {
            //         employees.forEach(emp => {
            //             emp.delete()
            //         })
            //     })
            //     .catch()

            let result = await department.delete()

            if (result) {
                return res.send({ success: true, msg: "Department deleted", document: result })
            }
            else {
                return res.send({ success: false, msg: "Error in deletion", document: result })
            }
        })
        .catch(err => { return res.send({ success: false, msg: "Department does not exist!", document: err.message }) })
})

module.exports = router