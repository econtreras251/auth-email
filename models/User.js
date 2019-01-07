const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: String,
    username: String,
    password: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;
module.exports.hashPassword = async () => {
    
}