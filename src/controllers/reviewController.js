const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")
//###################################################################################################################################################################
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
    let regEx = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;                     ///^\d{4}-\d{2}-\d{2}$/;
    if (!a.match(regEx)) return false;
    let date = new Date(a)
    if (date != "Invalid Date") return date.toISOString().slice(0, 10)
    else return false
}

//########################################################################################################################################################################

const createReview = async function (req, res) {
    try {
        const requestBodyReview = req.body
        const bookIdByParams = req.params.bookId
        const { reviewedBy, rating, review } = requestBodyReview

        if (!isValidObjectId(bookIdByParams)) return res.status(400).send({ status: false, message: "BookId is not valid ObjectId" })
        if (!(await bookModel.findOne({ _id: bookIdByParams, isDeleted: false }))) return res.status(400).send({ status: false, message: "Book is not created yet ,or Maybe Deleted" })
        requestBodyReview.bookId = bookIdByParams

        if (!isValidRequestBody(requestBodyReview)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide something to make review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewby field Should be Valid..." })

        if (!review) return res.status(400).send({ status: false, message: "review field is Required ..." })
        if (!isValid(review)) return res.status(400).send({ status: false, message: "review field Should be Valid..." })

        if (rating)
            if (!/\d/.test(rating)) return res.status(400).send({ status: false, message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, message: "rating range should be 1-5 ..." })

        requestBodyReview.reviewedAt = new Date()
        const createdReview = await reviewModel.create(requestBodyReview)
        const bookDetail = await bookModel.findOneAndUpdate({ _id: bookIdByParams }, { $inc: { reviews: 1 } }, { new: true }).lean()
        const allReviews = await reviewModel.find({ id: createdReview._id }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, _v: 0 })
        bookDetail.reviewdData = allReviews
        return res.status(201).send({ status: true, message: "created successfully", data: bookDetail })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}






const updateReview = async function (req, res) {
    //mayank
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const requestedBody = req.body
        const { reviewedBy, review, rating } = requestedBody

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookExist) return res.status(404).send({ status: false, message: "Book Not Found or Maybe Deleted" })

        const reviewExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExist) return res.status(404).send({ status: false, message: "Review Not Found or Maybe Deleted" })

        if (!isValidRequestBody(requestedBody)) return res.status(400).send({ status: false, message: "Invalid request parmeters,Please provide something to Update review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "reviewedBy is not valid ..." })

        if (review)
            if (!isValid(review)) return res.status(400).send({ status: false, message: "review is not valid ..." })

        if (rating)
            if (!/\d/.test(rating)) return res.status(400).send({ status: false, message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, message: "rating range should be 1-5 ..." })

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true })
        res.status(200).send({ status: true, message: "review update successfully", data: updatedReview })


    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}

const deleteReview = async function (req, res) {
    //nithish

    try {

        let review_Id = req.params.reviewId; //input takes from path params 

        if (!mongoose.isValidObjectId(review_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid reviewId" })

        let review = await reviewModel.findById(review_Id)//reviewId check form reviewModel

        if (review.isDeleted == true) return res.status(400).send({ status: false, msg: "this blog is already deleted" })

        let book_Id = req.params.bookId; //input takes from path params 

        if (!mongoose.isValidObjectId(book_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid BookId" })

        let book = await blogModel.findById(blog_Id)//bookId check form reviewModel

        if (book.isDeleted == true) return res.status(400).send({ status: false, msg: "this book is already deleted" })

        //--------------------------------------------------Deleted here--------------------------------------------------//

        let deletedreview = await reviewModel.findOneAndUpdate({ _id: review_Id }, { $set: { isDeleted: true, DeletedAt: Date.now() } }, { new: true });

        if (deleteByQuery.modifiedCount == 0) return res.status(400).send({ status: false, msg: "The review is already Deleted" })

        res.status(200).send({ status: true, data: deletedreview });

        let deletedBook = await blogModel.findOneAndUpdate({ _id: blog_Id }, { $set: { isDeleted: true, DeletedAt: Date.now() } }, { new: true });

        if (deleteByQuery.modifiedCount == 0) return res.status(400).send({ status: false, msg: "The Book is already Deleted" })

        res.status(200).send({ status: true, data: deletedBook });
        //--------------------------------------------------------------
    }

    catch (err) {

        res.status(500).send({ msg: "error", error: err.message })

    }

}

module.exports = { createReview, updateReview, deleteReview }