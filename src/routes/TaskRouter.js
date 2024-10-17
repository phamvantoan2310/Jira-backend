const express = require('express');
const router = express.Router();

const TaskController = require('../controller/TaskController');
const AuthMiddleWare = require('../middleware/authMiddleWare');


router.post("/createtask",AuthMiddleWare, TaskController.createTask)
router.put("/updatetask/:taskId",AuthMiddleWare, TaskController.updateTask)
router.put("/assigntasktouser/:taskId",AuthMiddleWare, TaskController.assignTaskToUser)
router.delete("/deletetask/:taskId",AuthMiddleWare, TaskController.deleteTask)
router.get("/gettaskbymanagerid",AuthMiddleWare, TaskController.getTaskByManagerId)
router.get("/gettaskbytaskid/:taskId", TaskController.getTaskByTaskId)
router.get("/gettaskbynameinproject/:projectId",AuthMiddleWare, TaskController.getTaskByNameInProject)
router.get("/gettaskfreebymanagerid",AuthMiddleWare, TaskController.getTaskFreeByManagerId)
module.exports = router