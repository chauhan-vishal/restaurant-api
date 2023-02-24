const express = require("express")
const router = express.Router()

const Employee = require("../schema/employee")

/**
 * @swagger
 * components :
 *      schema :
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
 * /

/**
 * @swagger
 * /api/employee/:
 *  get :
 *      summary : This api is used to get all employee details from database
 *      description : 
 *      responses : 
 *          200 :
 *              description : This api gets all document from employee table
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
 *                                      $ref : "#components/schema/Employee" 
 * */
router.get("/", (req, res) => {
    Employee.find({}, { __v: 0, createdAt: 0, updatedAt: 0, "address._id": 0 })
        .then(emp => { return res.send({ success: true, msg: "Employee found", document: emp }) })
        .catch(err => { return res.send({ success: false, msg: "Error Occred", document: err.msg }) })
})

/**
 * @swagger
 * /api/employee/new:
 *  post : 
 *      summary : This api is used to add new employee details in database
 *      description : This api is used to add new employee details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Employee"
 *      responses :
 *          200 : 
 *              description : Added Successfully
 *  */
router.post("/new", async (req, res) => {
    let employee = new Employee({
        name: {
            first: req.body.first,
            last: req.body.last,
        },
        gender: req.body.gender,
        contact: req.body.contact,
        email: req.body.email,
        address: {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            pincode: req.body.pincode
        },
        dob: req.body.dob,
        doj: req.body.doj,
        salary: Number(req.body.salary),
        allowances: {
            da: Number(req.body.da),
            bonus: Number(req.body.bonus)
        }
    })

    if (!await employee.exists()) {
        Department.findById(req.body.departmentId)
            .then(department => {
                employee.departmentId = department._id

                employee.save()
                    .then(emp => { return res.send({ success: true, msg: "Employee created", document: emp }) })
                    .catch(err => { return res.send({ success: true, msg: "Error in creation", document: err.message }) })
            })
            .catch(err => { return res.send({ success: false, msg: "Department does not exists", document: err.message }) })
    } else {
        return res.send({ success: false, msg: "Employee already exists", document: null })
    }
})

/**
 * @swagger
 * /api/employee/update:
 *  put : 
 *      summary : This api is used to update employee details in database
 *      description : This api is used to update employee details in database
 *      requestBody:
 *          required : true
 *          content : 
 *              application/json :
 *                  schema : 
 *                      $ref : "#components/schema/Employee"
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
 *                                      $ref : "#components/schema/Employee"
 *  */
router.put("/update", (req, res) => {
    Employee.findById(req.body.employeeId)
        .then(async employee => {

            let update = true;
            let employee2 = await Employee.findOne({ email: req.body.email })

            if (employee2 != null && employee2._id.toString() != employee._id.toString()) {
                return res.send({ success: false, msg: "Employee Email already exist", document: employee2 })
            }

            if (req.body.departmentId) {
                await Department.findById(req.body.departmentId)
                    .then(department => {
                        employee.departmentId = department._id
                    })
                    .catch(err => {
                        update = false;
                        return res.send({ success: false, msg: "Department does not exist", document: err.message })
                    })
            }

            if (update) {
                employee.name.set("first", req.body.first || employee.name.get("first"))
                employee.name.set("last", req.body.last || employee.name.get("last"))
                employee.gender = req.body.gender || employee.gender
                employee.contact = req.body.contact || employee.contact
                employee.email = req.body.email || employee.email
                employee.address.street = req.body.street || employee.address.street
                employee.address.city = req.body.city || employee.address.city
                employee.address.state = req.body.state || employee.address.state
                employee.address.country = req.body.country || employee.address.country
                employee.address.pincode = req.body.pincode || employee.address.pincode
                employee.dob = req.body.dob || employee.dob
                employee.doj = req.body.doj || employee.doj
                employee.salary = Number(req.body.salary) || employee.salary
                employee.allowances.set("da", Number(req.body.da) || employee.allowances.get("da"))
                employee.allowances.set("bonus", Number(req.body.bonus) || employee.allowances.get("bonus"))

                employee.save()
                    .then(employee => { return res.send({ success: true, msg: "Employee Updated", document: employee }) })
                    .catch(err => { return res.send({ success: false, msg: "Error in update", document: err.message }) })
            }

        })
        .catch(err => { return res.send({ success: false, msg: "Employee does not exist", document: err.message }) })
})

/**
 * @swagger
 * /api/employee/delete:
 *  delete : 
 *      summary : This api is used to delete all documents from database.
 *      description : This api is used to delete all documents from database.
 *      responses :
 *          200 : 
 *              description : Deleted Successfully
 *  */
router.delete("/delete", (req, res) => {
    Employee.deleteMany({})
        .then(emp => { return res.send({ success: true, msg: "Employees deleted", document: emp }) })
        .catch(err => { return res.send({ success: false, msg: "Error in deletion", document: err.message }) })
})

/**
 * @swagger
 * /api/employee/delete/{id}:
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
router.delete("/delete/:name", async (req, res) => {
    let employee = new Employee({ email: req.params.name })

    if (await employee.exists()) {
        let result = await employee.delete()

        if (result) {
            return res.send({ success: true, msg: "Employee deleted", document: result })
        } else {
            return res.send({ success: false, msg: "Error", document: null })
        }
    } else {
        return res.send({ success: false, msg: "Employee does not exists", document: null })
    }
})

module.exports = router