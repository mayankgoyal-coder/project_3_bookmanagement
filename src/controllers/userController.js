const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value ==="undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidTitle = function (value){
    return ["Mr","Mrs","Miss"].indexOf(value) != -1
}
const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length != 0
}

const userCreate = async function (req, res) {
    try {
        const requestBody = req.body
        const { title, name, phone, email, password, address } = requestBody
        const {street,city,pincode}=address

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide user details" })

        if(!title) return res.status(400).send({status:false,message:"Title is Required ..."})
        if(!isValidTitle(title)) return res.status(400).send({status:false,message:`${title} --> Title Should be among Mr,Mrs,Miss `})
         
        if(!name) return res.status(400).send({status:false,message:"Name is Required ..."})
        if(!isValid(name)) return res.status(400).send({status:false,message:"Name Should be valid ... "})
        if(!name.match(/^[a-zA-Z ]{2,30}$/)) return res.status(400).send({status:false,message:"Name Should not contain Number "})

        

        const emailAlready = await userModel.findOne({ email:email })
        if (emailAlready) return res.status(400).send({ status: false, message: "Email Already Exist" })

        const userCreated = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "User Created Successfully ", data: userCreated })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}

const userLogin = async function (req, res) {
    try {
        const requestBody = req.body
        const { email, password } = requestBody
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide user details" })

        const userLogin = await userModel.findOne({ email: email, password: password })
        console.log(userLogin)
        if (!userLogin) return res.status(400).send({ status: false, message: "Invalid Login Credentials" })

        const token = await jwt.sign({ userId: userLogin._id }, "Project3/BookManagement(@#@42)", { expiresIn: "60s" })
        return res.status(200).send({ status: true, message: "Login Successfully", data: token })
    }
    catch (err) {
        res.status(500).send({ status: false, messsage: err.messsage })
    }
}

module.exports = { userCreate, userLogin }
