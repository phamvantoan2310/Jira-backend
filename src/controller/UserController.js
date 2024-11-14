const UserService = require('../services/UserService')
const jwtService = require('../services/JsonWebTokenService')

const createUser = async (req, res) => {
    try {
        console.log(req.body);

        const { name, email, phone_number, password, confirm_password, gender, birthday, image } = req.body

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const isCheckEmail = regex.test(email)

        if (!name || !email || !phone_number || !password || !gender || !birthday || !confirm_password) {
            return res.status(200).json({
                status: "error",
                message: "The input is required!"
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: "error",
                message: "The input is not Email"
            })
        } else if (password !== confirm_password) {
            return res.status(200).json({
                status: "error",
                message: "The password is not equal"
            })
        }

        const result = await UserService.createUser(req.body);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const loginUser = async (req, res) => {
    try {
        console.log(req.body);

        const { email, password } = req.body

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const isCheckEmail = regex.test(email)

        if (!email || !password) {
            return res.status("error").json({
                status: "ERR",
                message: "The input is not required!"
            })
        } else if (!isCheckEmail) {
            return res.status("error").json({
                status: "ERR",
                message: "The input is not Email"
            })
        }

        const result = await UserService.loginUser(req.body);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body


        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required!"
            })
        }

        const result = await UserService.updateUser(userId, data);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id

        if (!userId) {
            return res.status(200).json({
                status: "ERR",
                message: "The userId is required!"
            })
        }

        const DeleteUser = await UserService.deleteUser(userId).then(
            result => {
                return res.status(200).json(result)
            }
        ).catch(
            err => {
                return res.status(200).json(err)
            }
        )


    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getAllUser = async (req, res) => {
    try {

        const getAllUser = await UserService.getAllUser().then(
            result => {
                return res.status(200).json(result)
            }
        ).catch(
            err => {
                return res.status(200).json(err)
            }
        )


    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const getUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({
                status: "error",
                message: "Authorization header is missing"
            });
        }
        const token = authHeader.split(" ")[1];
        const userId = await jwtService.getUserId(token);

        console.log(userId);

        const getUser = await UserService.getUser(userId).then(
            result => {
                return res.status(200).json(result)
            }
        ).catch(
            err => {
                return res.status(200).json(err)
            }
        )
    } catch (error) {
        return res.status(500).json({
            message: error
        })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(200).json({
                status: "error",
                message: "The email is required!"
            })
        }

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const isCheckEmail = regex.test(email);
        if (!isCheckEmail) {
            return res.status(200).json({
                status: "error",
                message: "The input is not Email"
            })
        }

        const result = await UserService.forgotPassword(email);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { OTP } = req.body;

        if (!OTP) {
            return res.status(200).json({
                status: "error",
                message: "The OTP is required!"
            })
        }

        const result = await UserService.verifyOTP(OTP);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const email = req.params.email;
        const data = req.body;

        console.log(email, data);

        if (!email) {
            return res.status(200).json({
                status: "ERR",
                message: "The email is required!"
            })
        }

        const result = await UserService.changePassword(email, data);
        return res.status(200).json(result)
    } catch (error) {
        return res.status(404).json({
            message: error
        })
    }
}


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getUser,
    forgotPassword,
    verifyOTP,
    changePassword
}