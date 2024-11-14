const Task = require('../models/TaskModel')
const Project = require('../models/ProjectModel')
const UserService = require('../services/UserService')
const ProjectService = require('../services/ProjectService')


const createTask = (userId, newTask) => {
    return new Promise(async (resolve, reject) => {
        const { name, description, start, due, instruction_file } = newTask
        try {

            const createTask = await Task.create({
                name,
                description,
                manager: userId,
                start_date: start,
                due_date: due,
                instruction_file,
                response_file: "",
                status: "Not-Started",
                assigned_to: null,
                project: null,
            }).then(
                result => {
                    resolve({
                        status: "OK",
                        message: "create success",
                        data: result
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "error",
                        message: "create fail",
                        error: "err:", err
                    })
                }
            )

        } catch (error) {
            reject(error);
        }
    })
}

const updateTask = (taskId, data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const task = await Task.findOne({
                _id: taskId
            });

            if (!task) {
                resolve({
                    status: "error",
                    message: "Task is not underfined",
                })
            }

            if (userId != task.manager) {   //user phải là manager thì được update (so sánh userid từ token với manager id từ task)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }

            await Task.findByIdAndUpdate(taskId, data, { new: true }).then(
                result => {
                    resolve({
                        status: "OK",
                        message: "update success",
                        data: result
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "error",
                        message: "update fail",
                        error: "err:", err
                    })
                }
            )

        } catch (error) {
            reject(error);
        }
    })
}

const deleteTask = (taskId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const task = await Task.findOne({   //lấy task
                _id: taskId
            })

            if (!task) {
                resolve({
                    status: "error",
                    message: "task is undefined"
                })
            }

            if (userId != task.manager) {   //user phải là manager thì được delete (so sánh userid từ token với userid từ task)
                resolve({
                    status: "error",
                    message: "The access is required"
                })
            }

            await Task.findByIdAndDelete(taskId).then(
                result => {
                    resolve({
                        status: "OK",
                        message: "delete success"
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "error",
                        message: "delete fail"
                    })
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}

const getTaskByManagerId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserService.getUser(userId)          //lấy data user từ user service


            if (result.status === "OK" && result.data) {
                const getTask = await Task.find({ manager: userId }).then(   //lấy task bằng user id
                    result => {
                        resolve({
                            status: "ok",
                            message: "get task success",
                            data: result
                        })
                    }
                ).catch(
                    err => {
                        resolve({
                            status: "ok",
                            message: "get task fail", err
                        })
                    }
                )
            } else {
                console.log("message err: ", result.message);
                resolve({
                    status: "ok",
                    message: "user is undefined"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getTaskByNameInProject = (projectId, taskName, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            console.log(projectId, ",", taskName, ",", userId)

            const project = await Project.findOne({  //lấy project với các task bằng populate
                _id: projectId
            }).populate('tasks');

            console.log(project)

            if (!project) {
                resolve({
                    status: "ERR",
                    message: "project is undefined",
                })
            }
            if (project.manager != userId) {   //so sánh user id và managerid của project
                resolve({
                    status: "ERR",
                    message: "access is required",
                })
            }

            const task = await project.tasks.find(task => task.name == taskName);  //tìm task theo tên

            if (!task) {
                resolve({
                    status: "ok",
                    message: "task not found",
                })
            } else {
                resolve({
                    status: "ok",
                    message: "project found",
                    data: task
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const assignTaskToUser = (taskId, userId, managerId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const task = await Task.findOne({
                _id: taskId
            })

            if (!task) {
                resolve({
                    status: "error",
                    message: "Task is not underfined",
                })
            }

            if (managerId != task.manager) {   //user phải là manager thì được update (so sánh userid từ token với manager id từ task)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }


            const checkUser = await UserService.getUser(userId);      //check user có tồn tại hay không
            if (checkUser.status === 'OK') {
                await Task.findByIdAndUpdate(taskId, { assigned_to: userId }, { new: true }).then(
                    result => {
                        resolve({
                            status: "OK",
                            message: "assign success",
                            data: result
                        })
                    }
                ).catch(
                    err => {
                        resolve({
                            status: "error",
                            message: "assign fail",
                            error: "err:", err
                        })
                    }
                )
            } else {
                resolve({
                    status: "error",
                    message: "user is not found",
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const getTaskByTaskId = (userId, taskId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getTask = await Task.findOne({ _id: taskId }).populate("assigned_to").populate("project");

            if (getTask) {
                if (!getTask.manager == userId) {
                    resolve({
                        status: "error",
                        message: "access is required"
                    })
                } else {
                    resolve({
                        status: "ok",
                        message: "get task success!",
                        data: getTask
                    })
                }
            } else {
                resolve({
                    status: "ok",
                    message: "task is not found!",
                    data: getTask
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const getTaskFreeByManagerId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserService.getUser(userId)          //lấy data user từ user service


            if (result.status === "OK" && result.data) {
                const getTask = await Task.find({ manager: userId, project: null }).then(   //lấy task bằng user id và chưa có project
                    result => {
                        resolve({
                            status: "OK",
                            message: "get tasks success",
                            data: result
                        })
                    }
                ).catch(
                    err => {
                        resolve({
                            status: "error",
                            message: "get task fail", err
                        })
                    }
                )
            } else {
                console.log("message err: ", result.message);
                resolve({
                    status: "error",
                    message: "user is undefined"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const removeFromProject = (taskId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const task = await Task.findOne({
                _id: taskId
            }).populate("project");

            if (!task) {
                resolve({
                    status: "error",
                    message: "Task is not underfined",
                })
            }

            if(!task.project._id){
                resolve({
                    status: "error",
                    message: "task is not in any project",
                })
            }
            const project = await Project.findOne({_id: task.project._id});

            if (userId != task.manager) {   //user phải là manager thì được update (so sánh userid từ token với manager id từ task)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }

            if(!project){
                resolve({
                    status: "error",
                    message: "Project is not found"
                })
            }

            const tasksInProject = project.tasks.filter(task => (task._id != taskId));  //xóa task khỏi tasks của project
            project.tasks = tasksInProject;
            const removeTaskFromProject = await project.save();

            task.project = null;                                                        // xóa project ở task
            const removeFromProject = await task.save();

            if(!removeFromProject && !removeTaskFromProject){
                resolve({
                    status: "error",
                    message: "remove task from project fail",
                    error: "err:", err
                })
            }else{
                resolve({
                    status: "OK",
                    message: "remove task from project success",
                })
            }






            await Task.find.then(
                result => {
                    resolve({
                        status: "OK",
                        message: "update success",
                        data: result
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "error",
                        message: "update fail",
                        error: "err:", err
                    })
                }
            )

        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createTask,
    updateTask,
    deleteTask,
    getTaskByManagerId,
    getTaskByNameInProject,
    assignTaskToUser,
    getTaskByTaskId,
    getTaskFreeByManagerId,
    removeFromProject
}