const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidTitle = function (value) {
    return ["Mr", "Mrs", "Miss"].indexOf(value) >= 0
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length != 0
}

const userCreate = async function (req, res) {
    try {
        const requestBody = req.body
        const { title, name, phone, email, password, address } = requestBody

        let nameRegex = /^[a-zA-Z ]{2,30}$/
        let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
        let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide user details" })

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValidTitle(title)) return res.status(400).send({ status: false, message: `${title} --> Title Should be among Mr,Mrs,Miss ` })

        if (!name) return res.status(400).send({ status: false, message: "Name is Required ..." })
        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name Should be valid ..." })
        if (!name.match(nameRegex)) return res.status(400).send({ status: false, message: "Name Should not contain Number " })

        if (!phone) return res.status(400).send({ status: false, Message: "Phone Number is Required ..." })
        if (!phone.match(phoneRegex)) return res.status(400).send({ status: false, Message: `${phone} Please enter valid Phone....` })

        if (!email) return res.status(400).send({ status: false, Message: "Email is Required ...." })
        if (!email.match(emailRegex)) return res.status(400).send({ status: false, Message: `${email} Please enter valid Email...` })

        if (!password) return res.status(400).send({ status: false, Message: " Password is Required ...." })
        if (password.length < 8 || password.length > 15) return res.status(400).send({ status: false, Message: " Password Length Should be Between 8 and 15 ..." })

        if (address) {
            const { street, city, pincode } = address
            if (street)
                if (!isValid(street)) return res.status(400).send({ status: false, message: "Street Should be valid ... " })
            if (city)
                if (!isValid(city)) return res.status(400).send({ status: false, message: "City Should be valid ... " })
            if (!city.match(nameRegex)) return res.status(400).send({ status: false, message: "City name  Should not contain Number " })
            if (pincode) {
                if (!isValid(pincode)) return res.status(400).send({ status: false, message: "Pincode Should be valid ... " })
                if (!pincode.match(/^[0-9]+$/)) return res.status(400).send({ status: false, Message: `${pincode} --> Pincode Should Only Contain Numbers...` })
            }
        }

        const emailAlready = await userModel.findOne({ email: email })
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
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, messsage: "Invalid request parmeters,please provide login details" })

        const userLogin = await userModel.findOne({ email: email, password: password })
        // console.log(userLogin)
        if (!userLogin) return res.status(400).send({ status: false, message: "Invalid Login Credentials" })

        const token = await jwt.sign({ userId: userLogin._id }, "Project3/BookManagement(@#@42)", { expiresIn: "60s" })
        return res.status(200).send({ status: true, message: "Login Successfully", data: token })
    }
    catch (err) {
        res.status(500).send({ status: false, messsage: err.messsage })
    }
}

module.exports = { userCreate, userLogin }
