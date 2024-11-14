const Project = require('../models/ProjectModel')
const Task = require('../models/TaskModel')
const UserService = require('../services/UserService')
const TaskService = require('./TaskService')

const createProject = (userId, newProject) => {
    return new Promise(async (resolve, reject) => {
        const { name, description, start, due, instruction_file } = newProject
        try {

            const createProject = await Project.create({
                name,
                description,
                manager: userId,
                start_date: start,
                due_date: due,
                instruction_file,
                status: "Not-Started",
                users: [],
                tasks: []
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

const updateProject = (projectId, data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const project = await Project.findOne({   //lấy project
                _id: projectId
            })

            if (!project) {
                resolve({
                    status: "ok",
                    message: "project is undefined"
                })
            }

            if (userId != project.manager) {   //user phải là manager thì được update (so sánh userid từ token với userid từ project)
                resolve({
                    status: "ok",
                    message: "authorization"
                })
            }

            const updateProject = await Project.findByIdAndUpdate(projectId, data, { new: true })
            if (!updateProject) {
                resolve({
                    status: "ok",
                    message: "update fail"
                })
            }

            resolve({
                status: "ok",
                message: "update success",
                data: updateProject
            })

        } catch (error) {
            reject(error);
        }
    })
}

const deleteProject = (projectId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const project = await Project.findOne({   //lấy project
                _id: projectId
            });

            if (!project) {
                resolve({
                    status: "error",
                    message: "project is undefined"
                })
            }

            if (userId != project.manager) {   //user phải là manager thì được delete (so sánh userid từ token với userid từ project)
                resolve({
                    status: "error",
                    message: "the access is required!"
                })
            }

            const tasks = project.tasks;
            tasks.map(taskId=>{
                TaskService.deleteTask(taskId, userId);
            })

            await Project.findByIdAndDelete(projectId).then(
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

const getProjectByManagerId = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await UserService.getUser(userId)          //lấy data user từ user service


            if (result.status === "OK" && result.data) {
                const getProject = await Project.find({ manager: userId }).then(   //lấy project bằng user id
                    result => {
                        resolve({
                            status: "ok",
                            message: "get project success",
                            data: result
                        })
                    }
                ).catch(
                    err => {
                        resolve({
                            status: "ok",
                            message: "get project fail", err
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

const addTaskToProject = (projectId, taskId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const checkTask = await Project.findOne({   //check task đã ở trong project nào đó chưa
                tasks: taskId
            }).populate('tasks');

            if (checkTask) {
                resolve({
                    status: "error",
                    message: "task is already in a project"
                })
            }




            const project = await Project.findOne({
                _id: projectId
            });

            const task = await Task.findOne({
                _id: taskId
            })

            if (!project) {
                resolve({                            //check project
                    status: "error",
                    message: "project is undefined"
                })
            } else if (!task) {                      //check task
                resolve({
                    status: "error",
                    message: "task is undefined"
                })
            } else if (userId != project.manager) {   //user phải là manager thì được update (so sánh userid từ token với userid từ project)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }

            const addIdProjectToTask = await TaskService.updateTask(taskId, {project: projectId}, userId);  //thêm id project vào task để nhận diện xem task đó đã ở trong project nào chưa
            if(!addIdProjectToTask){
                resolve({
                    status: "error",
                    message: "add id project to task fail",
                })
            }

            project.tasks.push(taskId);                 //thêm task id vào danh sách task và lưu project
            if(!project.users.includes(task.assigned_to) && task.assigned_to !== ""){   //nếu task đã được giao và user không nằm trong project thì thêm vào project
                project.users.push(task.assigned_to);
            }
            const addTaskToProject = await project.save()
            if (!addTaskToProject) {
                resolve({
                    status: "error",
                    message: "add task to project fail"
                })
            }

            resolve({
                status: "OK",
                message: "add task to project success",
                data: addTaskToProject
            })

        } catch (error) {
            reject(error);
        }
    })
}

const getProjectByProjectId = (userId, projectId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const getProject = await Project.findOne({ _id: projectId }).populate("tasks").populate("users");

            if (getProject) {
                if (!getProject.manager == userId) {
                    resolve({
                        status: "error",
                        message: "access is required"
                    })
                } else {
                    resolve({
                        status: "ok",
                        message: "get project success!",
                        data: getProject
                    })
                }
            } else {
                resolve({
                    status: "ok",
                    message: "project is not found!",
                    data: getProject
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

const addUserToProject = (projectId, users, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const project = await Project.findOne({
                _id: projectId
            });

            if (!project) {
                resolve({                            //check project
                    status: "error",
                    message: "project is undefined"
                })
            } else if (userId != project.manager) {   //user phải là manager thì được update (so sánh userid từ token với userid từ project)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }

            let userIdFail = [];

            for( let userId of users){            //add user id vào project, nếu user không tìm thấy thì add vào userIdFail để thông báo
                const user = await UserService.getUser(userId);
                if(!user.data){
                    userIdFail.push(userId);  //không tìm thấy user
                    continue;
                }else{
                    if(!project.users.includes(userId)){  //thêm id nếu nó không nằm trong userlist của project trước đó
                        project.users.push(userId);
                    }
                }
            }


            const addUserToProject = await project.save()
            if (!addUserToProject) {
                resolve({
                    status: "error",
                    message: "add users to project fail"
                })
            }

            resolve({
                status: "OK",
                message: "add users to project success",
                data: userIdFail
            })

        } catch (error) {
            reject(error);
        }
    })
}

const removeUserFromProject = (projectId, userRemoveId, userId) => {
    return new Promise(async (resolve, reject) => {
        try {

            const project = await Project.findOne({
                _id: projectId
            });

            if (!project) {
                resolve({                            //check project
                    status: "error",
                    message: "project is undefined"
                })
            } else if (userId != project.manager) {   //user phải là manager thì được update (so sánh userid từ token với userid từ project)
                resolve({
                    status: "error",
                    message: "authorization"
                })
            }



            project.users = project.users.filter(user=>(user?._id != userRemoveId));


            const removeUserFromProject = await project.save()
            if (!removeUserFromProject) {
                resolve({
                    status: "error",
                    message: "remove user from project fail"
                })
            }

            resolve({
                status: "OK",
                message: "remove user from project success",
            })

        } catch (error) {
            reject(error);
        }
    })
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