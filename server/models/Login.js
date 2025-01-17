const mongoose = require('mongoose');

const signupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure unique email addresses
    },
    password: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("User", signupSchema);
