const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        // trim: true,
    },
    email: {
        type: String,
        // required: true,
        // unique: true,
        // lowercase: true,
        // validate: value => {
        //     if (!validator.isEmail(value)) {
        //         throw new Error({ error: 'Invalid Email address' });
        //     }
        // },
    },
    password: {
        type: String,
        // required: true,
        // minLength: 7,
    },
    birthday: {
        type: String,
        // required: true,
        // minLength: 7,
    },
    money: {
        type: Number,
        default: 0,
        min: 0,
    },
    holdings: {
        type: Array,
        default: [],
    },
    // tokens: [
    //     {
    //         token: {
    //             type: String,
    //             required: true,
    //         },
    //     },
    // ],
});

userSchema.pre('save', async function(next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

// userSchema.methods.makeDeposit = async function(amount) {
//     // Generate an auth token for the user
//     const user = this;
//     await User
//     await user.save();
//     return user;
// };

userSchema.statics.makeDeposit = async (email, amount) => {
    // Search for a user by email and password.
    // await User.
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: 'No user' });
    }
    user.money = user.money + +amount;

    user.save();

    return user;
};

// userSchema.methods.generateAuthToken = async function() {
//     // Generate an auth token for the user
//     const user = this;
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
//     user.tokens = user.tokens.concat({ token });
//     await user.save();
//     return token;
// };

// userSchema.statics.findByCredentials = async (email, password) => {
//     // Search for a user by email and password.
//     const user = await User.findOne({ email });
//     if (!user) {
//         throw new Error({ error: 'Invalid login credentials' });
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//         throw new Error({ error: 'Invalid login credentials' });
//     }
//     return user;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;
