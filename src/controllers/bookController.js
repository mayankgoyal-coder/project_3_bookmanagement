const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")

//######################################################################################################################
const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length != 0
}

const isValidObjectId = function (Id) {
    return mongoose.isValidObjectId(Id)          //mongoose.Types.ObjectId.isValid(Id)
}

//######################################################################################################################

const createBook = async (req, res) => {
    try {
        const requestBody = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })

        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is Required ..." })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt Should be Valid..." })

        if (!userId) return res.status(400).send({ status: false, message: "UserId is Required ..." })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "UserId Should be Valid..." })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "bookId is not valid ObjectId" })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is Required ..." })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
        if (!ISBN.match(ISBNRagex)) return res.status(400).send({ status: false, message: "ISBN Should only contain Number and - and length of 10 and 13 only " })

        if (!category) return res.status(400).send({ status: false, message: "Category is Required ..." })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Category Should be Valid..." })

        if (!subcategory) return res.status(400).send({ status: false, message: "Subcategory is Required ..." })

        if (!releasedAt) return res.status(400).send({ status: false, message: "ReleasedAt is Required ..." })

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide Book details" })
        const createdBook = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "created successfully", data: createdBook })
    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//==============================================getBookByQueryParams====================================================//
const getBookByQueryParams = async (req, res) => {
    try {

        const requestBody = req.query;
        console.log(requestBody)

        if (!Object.keys(requestBody).length) return res.status(404).send({ status: false, msg: "query must be present" })
        // if (!requestBody.userId) return res.status(404).send({ status: false, msg: "bookId should be present" }) 
        // if (!requestBody.title) return res.status(404).send({ status: false, msg: "title should be present" })
        // if (!requestBody.excerpt) return res.status(404).send({ status: false, msg: "excerpt should be present" })
        // if (!requestBody.userId) return res.status(404).send({ status: false, msg: "userId should be present" })
        // if (!requestBody.category) return res.status(404).send({ status: false, msg: "category should be present" }) 
        // if (!requestBody.subcategory) return res.status(404).send({ status: false, msg: "subcategory should be present" }) 

        //---------------------------------------------------Query param------------------------------------------------------------//
        // if (!mongoose.isValidObjectId(requestBody.userId)) return res.status(400).send({ status: false, msg: "Enter a Valid userId" })
        let BookData = await bookModel.find(requestBody)
        if (!BookData) return res.status(400).send({ status: false, msg: "No such userId found" })
        return res.status(201).send({ status: true, message: "Found successfully", data: BookData })
        

        // if (!Array.isArray(requestBody.category)) return res.status(400).send({ status: false, msg: "category Should be an Array" })

        // if (!Array.isArray(requestBody.subcategory)) return res.status(400).send({ status: false, msg: "subcategory Should be an Array" })

        //---------------------------------------------Sorted in alphabetical order------------------------------------------------------//

        // // take input
        // let  title=["The Wheels of Chance","HARRY POTTER",""]
        // let bookNameSorted=title.sort()
        // console.log(bookNameSorted)

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        const getBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!getBook) return res.status(404).send({ status: false, message: "No Book Found" });
        let data = JSON.parse(JSON.stringify(getBook))   // deep cloning
        data.reviewsData=[]
        console.log(data)

        // const bookDetails = {
        //     _id: getBook._id,
        //     title: getBook.title,
        //     excerpt: getBook.excerpt,
        //     userId: getBook.userId,
        //     category: getBook.category,
        //     subcategory: getBook.subcategory,
        //     deleted: getBook.deleted,
        //     reviews: getBook.reviews,
        //     deletedAt: getBook.deletedAt,
        //     releasedAt: getBook.releasedAt,
        //     createdAt: getBook.createdAt,
        //     updatedAt: getBook.updatedAt,
        //     reviewsData: []
        // }

        return res.status(201).send({ status: true, message: "Success", data: data })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }

}

const updateBookById = async (req, res) => {
    try {

        const bookId = req.params.bookId
        const requestUpdateBody = req.body
        const { title, excerpt, ISBN, releasedAt } = requestUpdateBody
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        const searchBook = await bookModel.findById({ _id: bookId, isdeleted: false })
        if (!searchBook)
            return res.status(404).send({ status: false, massage: "This book does not exist" })

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })
        res.status(201).send({ status: true, message: "update successfully", data: updatedBooks })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}

const deleteById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "book id is not valid" })
        const deletedBook = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!deletedBook) return res.status(404).send({ status: false, message: "Book Not Found" })

        const deleteB = await bookModel.findOneAndUpdate({ _id: deletedBook._id }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Blog deleted succesfully", data: deleteB })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createBook, getBookByQueryParams, getBookById, updateBookById, deleteById }