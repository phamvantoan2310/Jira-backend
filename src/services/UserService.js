const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require('./JsonWebTokenService')


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, phone_number, password, gender, birthday, image } = newUser
        try {
            const isEmailAlready = await User.findOne({
                email: email
            })

            const isPhoneNumberAlready = await User.findOne({
                phone_number: phone_number
            })

            if (isEmailAlready !== null) {
                resolve({
                    status: "error",
                    message: "The email is already!"
                })
            }

            if (isPhoneNumberAlready !== null) {
                resolve({
                    status: "error",
                    message: "The phone_number is already!"
                })
            }

            const hash = bcrypt.hashSync(password, 10)

            console.log(hash);

            const createUser = await User.create({
                name,
                email,
                phone_number,
                password: hash,
                gender,
                birthday,
                image
            })
            if (createUser) {
                resolve({
                    status: "OK",
                    message: "create successful",
                    data: createUser
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

const loginUser = (loginUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = loginUser
        try {
            const checkUser = await User.findOne({
                email: email
            })


            if (checkUser === null) {
                resolve({
                    status: "error",
                    message: "The user is not defined!"
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)

            if (!comparePassword) {
                resolve({
                    status: "error",
                    message: "Email or password is incorrect!",
                })
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id
            })

            console.log(access_token);

            resolve({
                status: "OK",
                message: "login success",
                jwt: access_token
            })
        } catch (error) {
            reject(error);
        }
    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined!"
                })
            }

            const update_user = await User.findByIdAndUpdate(id, data, { new: true }).then(
                result => {
                    resolve({
                        status: "OK",
                        message: "Success",
                        data: result
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "OK",
                        message: err,
                    })
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            })

            if (checkUser === null) {
                resolve({
                    status: "OK",
                    message: "The user is not defined!"
                })
            }

            await User.findByIdAndDelete(id).then(
                result => {
                    resolve({
                        status: "OK",
                        message: "Delete Success",
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "OK",
                        message: err,
                    })
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const getAllUser = await User.find().then(
                result => {
                    resolve({
                        status: "OK",
                        message: "Success",
                        data: result
                    })
                }
            ).catch(
                err => {
                    resolve({
                        status: "OK",
                        message: "get all user fail",
                    })
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}

const getUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: id
            }).then(
                result => {
                    if (result === null) {
                        resolve({
                            status: "error",
                            message: "The user is not defined!"
                        })
                    } else {
                        resolve({
                            status: "OK",
                            message: "Success",
                            data: result
                        })
                    }
                }
            ).catch(
                err => {
                    resolve({
                        status: "error",
                        message: err
                    })
                }
            )
        } catch (error) {
            reject(error);
        }
    })
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getUser
}