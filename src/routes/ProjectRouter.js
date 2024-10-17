const express = require('express');
const router = express.Router();

const ProjectController = require("../controller/ProjectController");
const AuthMiddleWare = require('../middleware/authMiddleWare');

router.post("/createproject",AuthMiddleWare, ProjectController.createProject)
router.put("/updateproject/:projectId",AuthMiddleWare, ProjectController.updateProject)
router.delete("/deleteproject/:projectId",AuthMiddleWare, ProjectController.deleteProject)
router.get("/getprojectbymanagerid",AuthMiddleWare, ProjectController.getProjectByManagerId)
router.put("/addtasktoproject/:projectId",AuthMiddleWare, ProjectController.addTaskToProject)
router.get("/getprojectbyprojectid/:projectId",AuthMiddleWare, ProjectController.getProjectByProjectId)
router.put("/addusertoproject/:projectId",AuthMiddleWare, ProjectController.addUserToProject)
module.exports = router