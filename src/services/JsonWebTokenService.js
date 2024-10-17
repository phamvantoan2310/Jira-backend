const JWT = require('jsonwebtoken')
const dotenv = require('dotenv');
const { use } = require('bcrypt/promises');
dotenv.config();

const genneralAccessToken = async (payload) => {
    const access_token = JWT.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: "1d" })

    return access_token;
}

const genneralRefreshToken = async (payload) => {
    const refresh_token = JWT.sign({
        payload
    }, process.env.REFRESH_TOKEN, { expiresIn: "365d" })

    return refresh_token;
}


const getUserId = (token) => {
    return new Promise(async(resolve, reject) => {
        await JWT.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return reject({
                    status: "error",
                    message: "Invalid token"
                });
            }

            if(user && user.id){
                resolve(user.id); // Trả về ID từ user
            }
            else{
                reject(new Error("payload contain a err id"));
            }
        });
    });
};


module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    getUserId
}