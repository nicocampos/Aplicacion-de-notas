const mongoose = require('mongoose')
const {Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: {type: String, required: true},
    codeAuth: { type: String, required: true},
    auth: { type: Boolean, required: true},
    date: { type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); // aplico 10 veces el algoritmo
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);