const reviewModel = require("../models/reviewModel")
const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")
//#######################################################################################################################################################################
//Here We Requiring All the validation function from util/validations
const {isValid,isValidRequestBody,isValidObjectId,isValidDate} = require("../utils/validations")
//#######################################################################################################################################################################

const createReview = async function (req, res) {
    try {
        const requestBodyReview = req.body
        const bookIdByParams = req.params.bookId
        const { reviewedBy, rating, review } = requestBodyReview

        if (!isValidObjectId(bookIdByParams)) return res.status(400).send({ status: false, Message: "BookId is not valid ObjectId" })
        if (!(await bookModel.findOne({ _id: bookIdByParams, isDeleted: false }))) return res.status(400).send({ status: false, Message: "Book is not created yet ,or Maybe Deleted" })
        requestBodyReview.bookId = bookIdByParams

        if (!isValidRequestBody(requestBodyReview)) return res.status(400).send({ status: false, Message: "Invalid request parmeters,Please provide something to make review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, Message: "Reviewby field Should be Valid..." })

        if (!review) return res.status(400).send({ status: false, Message: "review field is Required ..." })
        if (!isValid(review)) return res.status(400).send({ status: false, Message: "review field Should be Valid..." })

        if (rating)
            if (!/\d/.test(rating)) return res.status(400).send({ status: false, Message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, Message: "rating range should be 1-5 ..." })

        requestBodyReview.reviewedAt = new Date()
        const createdReview = await reviewModel.create(requestBodyReview)
        const bookDetail = await bookModel.findOneAndUpdate({ _id: bookIdByParams }, { $inc: { reviews: 1 } }, { new: true }).lean()
        const allReviews = await reviewModel.find({ id: createdReview._id }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, _v: 0 })
        bookDetail.reviewedData = allReviews
        return res.status(201).send({ status: true, Message: "created successfully", data: bookDetail })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}
//########################################################################################################################################################################

const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const requestedBody = req.body
        const { reviewedBy, review, rating } = requestedBody

        const bookExist = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!bookExist) return res.status(404).send({ status: false, Message: "Book Not Found or Maybe Deleted" })

        const reviewExist = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!reviewExist) return res.status(404).send({ status: false, Message: "Review Not Found or Maybe Deleted" })

        if (!isValidRequestBody(requestedBody)) return res.status(400).send({ status: false, Message: "Invalid request parmeters,Please provide something to Update review" })

        if (reviewedBy)
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, Message: "reviewedBy is not valid ..." })

        if (review)
            if (!isValid(review)) return res.status(400).send({ status: false, Message: "review is not valid ..." })

        if (rating)
            if (!/\d/.test(rating)) return res.status(400).send({ status: false, Message: "rating  should be number ..." })
        if (rating > 5 || rating < 1 || typeof rating != "number") return res.status(400).send({ status: false, Message: "rating range should be 1-5 ..." })

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { reviewedBy: reviewedBy, review: review, rating: rating }, { new: true })
        res.status(200).send({ status: true, Message: "review update successfully", data: updatedReview })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })

    }
}
//########################################################################################################################################################################

const deleteReview = async function (req, res) {
    try {
        const reviewId = req.params.reviewId;
        const bookId = req.params.bookId;
        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, Message: "Enter a Valid BookId" })
        const book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) return res.status(400).send({ status: false, Message: "This book is already deleted " })

        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, Message: "Enter a Valid reviewId" })
        const review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review) return res.status(400).send({ status: false, Message: "this review is already deleted" })
        
        //--------------------------------------------------Deleted here--------------------------------------------------//

        const bookReview = await reviewModel.findOne({_id: reviewId, bookId: bookId})
        if(!bookReview) return res.status(400).send({ status: false, Message: "This review is not belong to this book" })

        const deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { $set: { isDeleted: true, DeletedAt: Date.now() } }, { new: true });
        await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })
        res.status(200).send({ status: true, Message: "Review Deleted Successfully", data: deletedReview });
    }
    catch (err) {
        res.status(500).send({ Message: "error", error: err.message })
    }
}
//########################################################################################################################################################################

module.exports = { createReview, updateReview, deleteReview }