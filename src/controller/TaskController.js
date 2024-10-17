const jwtService = require('../services/JsonWebTokenService')
const TaskService = require('../services/TaskService')


const createTask = async (req, res) => {
    try {
        const { name, description, start, due, instruction_file } = req.body

        const authHeader = req.headers['authorization'];    //lấy user id từ token
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);


        if (!userId) {
            return (
                res.status(200).json({
                    status: "ERR",
                    message: "The user id is required"
                })
            )
        }

        if (!name || !description || !start || !due || !instruction_file) {
            return (
                res.status(200).json({
                    status: "ERR",
                    message: "The input is required"
                })
            )
        }

        const createTask = await TaskService.createTask(userId, req.body).then(
            result => {
                return res.status(200).json(result);
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err })
            }
        )

    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const updateTask = async (req, res) => {
    try {
        const taskId = req.params.taskId

        const data = req.body

        const authHeader = req.headers['authorization'];      //lấy user id để so sánh với manager id của task 
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        const updateTask = await TaskService.updateTask(taskId, data, userId)
        if (!updateTask) {
            return res.status(200).json({ "error": err })
        }

        return res.status(200).json(updateTask);

    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.taskId

        const authHeader = req.headers['authorization'];      //lấy user id để so sánh với manager id của task 
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        await TaskService.deleteTask(taskId, userId).then(
            result => {
                return res.status(200).json({
                    status: "OK",
                    message: "delete success"
                });
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err })
            }
        )




    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const getTaskByManagerId = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];    //lấy user id từ token
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        await TaskService.getTaskByManagerId(userId).then(
            result => {
                return res.status(200).json(result);
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err });
            }
        )



    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const getTaskByNameInProject = async (req, res) => {
    try {

        const projectId = req.params.projectId
        const taskName = req.query.taskName

        console.log("projectId: ", projectId, "taskName: ", taskName)

        if (!projectId || !taskName) {
            return res.status(404).json({
                status: "ERR",
                message: "project id or task name is required!"
            })
        }

        const authHeader = req.headers['authorization'];    //lấy user id từ token
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);

        const result = await TaskService.getTaskByNameInProject(projectId, taskName, userId);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(200).json({ "error": "lỗi khi gọi TaskService.getTaskByNameInProject" })
        }



    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR task conttroller",
                message: error
            })
        )
    }
}

const assignTaskToUser = async (req, res) => {
    try {
        const taskId = req.params.taskId

        const data = req.body

        const authHeader = req.headers['authorization'];      //lấy user id để so sánh với manager id của task 
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);


        const assignTaskToUser = await TaskService.assignTaskToUser(taskId, data.assign_to, userId);
        if (!assignTaskToUser) {
            return res.status(200).json({ "error": err })
        }

        if(assignTaskToUser.status !== 'OK'){
            return res.status(200).json({
                status: "error",
                message: assignTaskToUser.message
            });
        }else{
            return res.status(200).json({
                status: "OK",
                assignTaskToUser
            });
        }

    } catch (error) {
        return (
            res.status(500).json({
                status: "error",
                message: error
            })
        )
    }
}

const getTaskByTaskId = async (req, res) => {
    try {
        const taskId = req.params.taskId

        const authHeader = req.headers['authorization'];    //lấy user id từ token
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        await TaskService.getTaskByTaskId(userId, taskId).then(
            result => {
                return res.status(200).json(result);
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err });
            }
        )



    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const getTaskFreeByManagerId = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];    //lấy user id từ token
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        await TaskService.getTaskFreeByManagerId(userId).then(
            result => {
                return res.status(200).json({
                    status: "OK",
                    result
                });
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err });
            }
        )



    } catch (error) {
        return (
            res.status(404).json({
                status: "ERR",
                message: error
            })
        )
    }
}
module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTaskByManagerId,
    getTaskByNameInProject,
    assignTaskToUser,
    getTaskByTaskId,
    getTaskFreeByManagerId
}