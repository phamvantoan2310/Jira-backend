const ProjectService = require('../services/ProjectService')
const jwtService = require('../services/JsonWebTokenService')

const createProject = async (req, res) => {
    try {
        const { name, description, start, due, instruction_file } = req.body;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);


        if (!name || !description || !start || !due || !instruction_file) {
            return (
                res.status(200).json({
                    status: "error",
                    message: "The input is required"
                })
            )
        }

        const createProject = await ProjectService.createProject(userId, req.body).then(
            result => {
                return res.status(200).json({
                    status: "OK",
                    result
                });
            }
        ).catch(
            err => {
                return res.status(200).json({ "error": err })
            }
        )

    } catch (error) {
        return (
            res.status(500).json({
                status: "error",
                message: error
            })
        )
    }
}

const updateProject = async (req, res) => {
    try {
        const projectId = req.params.projectId
        const data = req.body

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        const updateProject = await ProjectService.updateProject(projectId, data, userId)
        if (!updateProject) {
            return res.status(200).json({ "error": err })
        }

        return res.status(200).json({
            status: "OK",
            updateProject
        });

    } catch (error) {
        return (
            res.status(500).json({
                status: "error",
                message: error
            })
        )
    }
}

const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.projectId

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        await ProjectService.deleteProject(projectId, userId).then(
            result => {
                return res.status(200).json(result);
            }
        ).catch(
            err => {
                return res.status(500).json({ "error": err });
            }
        )



    } catch (error) {
        return (
            res.status(500).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const getProjectByManagerId = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);


        await ProjectService.getProjectByManagerId(userId).then(
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
            res.status(500).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const addTaskToProject = async (req, res) => {
    try {
        const projectId = req.params.projectId

        const data = req.body

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);



        const addTask = await ProjectService.addTaskToProject(projectId, data.taskId, userId)
        if (!addTask) {
            return res.status(500).json({ "error": addTask.status })
        }

        return res.status(200).json({
            status: 'OK',
            addTask,
        });

    } catch (error) {
        return (
            res.status(500).json({
                status: "error",
                message: error
            })
        )
    }
}

const getProjectByProjectId = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "ERR",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);

        await ProjectService.getProjectByProjectId(userId, projectId).then(
            result => {
                return res.status(200).json(result);
            }
        ).catch(
            err => {
                return res.status(500).json({ "error": err });
            }
        )



    } catch (error) {
        return (
            res.status(500).json({
                status: "ERR",
                message: error
            })
        )
    }
}

const addUserToProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const data = req.body;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);

        const addUser = await ProjectService.addUserToProject(projectId, data.users, userId)
        if (!addUser) {
            return res.status(500).json({ "error": addUser.message })
        }

        return res.status(200).json({
            status: 'OK',
            data: addUser,
        });
    } catch (error) {
        return (
            res.status(500).json({
                status: "error r",
                message: error
            })
        )
    }
}

const removeUserFromProject = async (req, res) => {
    try {
        const projectId = req.params.IdProject;

        const data = req.body;

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);

        const removeUser = await ProjectService.removeUserFromProject(projectId, data.userId, userId);
        if (!removeUser) {
            return res.status(500).json({ "error": removeUser.error })
        }

        return res.status(200).json({
            status: 'OK',
            data: removeUser,
        });
    } catch (error) {
        return (
            res.status(500).json({
                status: "error",
                message: error
            })
        )
    }
}

module.exports = {
    createProject,
    updateProject,
    deleteProject,
    getProjectByManagerId,
    addTaskToProject,
    getProjectByProjectId,
    addUserToProject,
    removeUserFromProject
}