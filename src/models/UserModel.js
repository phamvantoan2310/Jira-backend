const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
    {
        name: {type: String, require: true},
        email: {type: String, require: true, unique: true},
        phone_number: {type: String, require: true, unique: true},
        password: {type: String, require: true},
        gender: {type: String, enum: ['male', 'female', 'other'], require: true},
        birthday: {type: String, require:true},
        image: {type: String},
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;