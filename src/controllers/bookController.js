const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const mongoose = require("mongoose")
const moment = require("moment")
const { request } = require("express")

//#######################################################################################################################################################################
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

const isValidDate = function (a) {
    const regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;                     ///^\d{4}-\d{2}-\d{2}$/;       //yyyy-mm-dd    //yyyy-m-d
    if (!a.match(regEx)) return false;
    let date = new Date(a)
    if (date != "Invalid Date") return date.toISOString().slice(0, 10)       //    2022-05-10T08:55:46.266+00:00
    else return false
}

// const isValidDate = (date) => {    //2022-03-30
//     let  d = new Date(date);
//     console.log(date.slice(8,10))
//     console.log(date.slice(5,7) )
//     console.log(date.slice(0,4))
//     if (d.getFullYear() == date.slice(0,4) && d.getMonth() == date.slice(5,7) && d.getDate() == date.slice(8,10)) {
//         return true;
//     }
//     return false;
// }

//#######################################################################################################################################################################

const createBook = async (req, res) => {
    try {
        const requestBody = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/

        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide Book details" })

        if (!userId) return res.status(400).send({ status: false, message: "UserId is Required ..." })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "UserId Should be Valid..." })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "UserId is not valid ObjectId" })
        if (!(await userModel.findOne({ _id: userId }))) return res.status(400).send({ status: false, message: "User not Registered yet" })

        if (!title) return res.status(400).send({ status: false, message: "Title is Required ..." })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })
        if (await bookModel.findOne({ title })) return res.status(400).send({ status: false, message: "Title Already Used by Someone...Provide Unique Title" })

        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is Required ..." })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt Should be Valid..." })

        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is Required ..." })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
        if (!ISBN.match(ISBNRagex)) return res.status(400).send({ status: false, message: "ISBN Should only contain Number and - and length of 10 and 13 only " })
        if (await bookModel.findOne({ ISBN })) return res.status(400).send({ status: false, message: "ISBN Already Used by Someone...Provide Unique ISBN" })

        if (!category) return res.status(400).send({ status: false, message: "Category is Required ..." })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Category Should be Valid..." })

        if (!subcategory) return res.status(400).send({ status: false, message: "Subcategory is Required ..." })
        if (Array.isArray(subcategory)) subcategory = subcategory.map(el => el.trim()).filter(el => el)
        if (Object.prototype.toString.call(subcategory) === "[object String]") subcategory = subcategory.trim()

        if (!releasedAt) return res.status(400).send({ status: false, message: "ReleasedAt is Required ..." })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt Date Format should be YYYY-MM-DD " })

        const createdBook = await bookModel.create(requestBody)
        return res.status(201).send({ status: true, message: "created successfully", data: createdBook })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################
const getBookByQueryParams = async (req, res) => {
    try {
        const requestBody = req.query;        // {userId,category,subcategory}   {u},{u,c},{u,c,s}
        const filterQuery = { isDeleted: false }

        if (isValidRequestBody(requestBody)) {
            if (requestBody.userId) {
                filterQuery.userId = requestBody.userId.trim()
            }
            if (requestBody.category) {
                filterQuery.category = requestBody.category.trim()
            }
            if (requestBody.subcategory) {
                filterQuery.subcategory = requestBody.subcategory.split(",").map(el => el.trim())
            }
        }

        let bookData = await bookModel.find(filterQuery).sort({ title: 1 })   //.select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 ,isDeleted:1 })
        if (!bookData) return res.status(404).send({ status: false, msg: "No Book found" })

        return res.status(201).send({ status: true, message: "Found successfully", data: bookData })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################

const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        const getBook = await bookModel.findOne({ _id: bookId, isDeleted: false });
        if (!getBook) return res.status(404).send({ status: false, message: "No Book Found" });
        let bookDetails = JSON.parse(JSON.stringify(getBook))   // deep cloning

        const reviewdata = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        bookDetails.reviewsData = reviewdata
        // console.log(data)

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

        return res.status(201).send({ status: true, message: "Success", data: bookDetails })

    } catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################

const updateBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId
        const requestUpdateBody = req.body
        const { title, excerpt, ISBN, releasedAt } = requestUpdateBody
        const ISBNRagex = /^[\d*\-]{10}|[\d*\-]{13}$/

        //  check for other things that comes from requestbody

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "bookId is not valid" })
        if (!isValidRequestBody(requestUpdateBody)) return res.status(400).send({ status: false, message: "Please Provide something to Update" })

        if (title != undefined) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Title Should be Valid..." })
            if (await bookModel.findOne({ title })) return res.status(400).send({ status: false, message: "Title Already Used by Someone.. or You Already Updated it With Provided Title" })
        }
        if (excerpt != undefined) {
            if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt Should be Valid..." })
        }
        if (ISBN != undefined) {
            if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN Should be Valid..." })
            if (!ISBN.match(ISBNRagex)) return res.status(400).send({ status: false, message: "ISBN Should only contain Number and - and length of 10 and 13 only " })
            if (await bookModel.findOne({ ISBN })) return res.status(400).send({ status: false, message: "ISBN Already Used by SomeBody... or You Already Updated it With Provided ISBN" })
        }
        if (releasedAt != undefined) {
            if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt Date Format should be like YYYY-MM-DD " })
        }
        const bookToBeUpdated = await bookModel.findOne({ _id: bookId, isdeleted: false })
        if (!bookToBeUpdated) return res.status(404).send({ status: false, massage: "This book does not exist or Maybe Deleted" })

        const updatedBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt }, { new: true })
        res.status(200).send({ status: true, message: "update successfully", data: updatedBooks })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}

//#######################################################################################################################################################################

const deleteById = async (req, res) => {
    try {
        const bookId = req.params.bookId

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "book id is not valid" })

        const bookToBeDeleted = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookToBeDeleted) return res.status(404).send({ status: false, message: "Book Not Found" })

        const deletedBook = await bookModel.findOneAndUpdate({ _id: bookToBeDeleted._id }, { $set: { isDeleted: true, deletedAt: new Date() } }, { new: true })
        return res.status(200).send({ status: true, message: "Blog deleted succesfully", data: deletedBook })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

//#######################################################################################################################################################################


module.exports = { createBook, getBookByQueryParams, getBookById, updateBookById, deleteById }