const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")

const createBook = async (req, res) => {
    try {
        const requestBody = req.body
        const createdBook = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "created successfully", data: createdBook })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

const getBookByQueryParams = async (req, res) => {
//Nithishbro
}

const getBookById = async (req, res) => {
//Tejasvi
}

const updateBookById = async (req, res) => {
//mayankbro
}

const deleteById = async (req, res) => {
//Shrikantbro
}


module.exports = { createBook, getBookByQueryParams, getBookById, updateBookById ,deleteById }