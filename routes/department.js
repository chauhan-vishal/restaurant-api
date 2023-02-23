const express = require("express")
const router = express.Router()

const Department = require("../schema/department")

// Department
// ==================================================================================================================
/**
 * @swagger
 * /:
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
 * /new:
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
 * /update:
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
 * /delete:
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
 * /delete/{id}:
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

            Employee.find({ departmentId: department._id })
                .then(employees => {
                    employees.forEach(emp => {
                        emp.delete()
                    })
                })
                .catch()

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