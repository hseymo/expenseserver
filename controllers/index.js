const express = require('express');
const router = express.Router();

const userRoutes = require("./userController")
router.use("/api/users",userRoutes)

const categoryRoutes = require("./categoryController")
router.use("/api/categories",categoryRoutes)

const subcategoryRoutes = require("./subcategoryController")
router.use("/api/subcategories",subcategoryRoutes)

module.exports = router;