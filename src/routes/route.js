const express = require("express");
const router = express.Router();
const { userCreate, userLogin } = require("../controllers/userController")
const { createBook, getBookByQueryParams, getBookById, updateBookById, deleteById } = require("../controllers/bookController")
const { createReview ,updateReview ,deleteReview} = require("../controllers/reviewController")

//----------User-------------------//
router.post("/register", userCreate)
router.post("/login", userLogin)

//----------Book-------------------//
router.post("/books", createBook)
router.get("/books", getBookByQueryParams)
router.get("/books/:bookId", getBookById)
router.put("/books/:bookId", updateBookById)
router.delete("/books/:bookId", deleteById)

//----------Review-------------------//
router.post("/books/:bookId/review", createReview)
router.put("/books/:bookId/review/:reviewId",updateReview)
router.delete("/books/:bookId/review/:reviewId",deleteReview)

module.exports = router