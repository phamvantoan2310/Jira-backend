const express = require('express');
const router = express.Router();

const UserController = require('../controller/UserController');
const AuthMiddleWare = require('../middleware/authMiddleWare');


router.post("/sign-up", UserController.createUser)
router.post("/sign-in", UserController.loginUser)
router.put("/update/:id",AuthMiddleWare, UserController.updateUser)
router.delete("/delete/:id",AuthMiddleWare, UserController.deleteUser)
router.get("/getalluser",AuthMiddleWare, UserController.getAllUser)
router.get("/getuser",AuthMiddleWare, UserController.getUser)
module.exports = router
