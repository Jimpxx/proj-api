const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    birthday: {
        type: String,
    },
    money: {
        type: Number,
        default: 0,
        min: 0,
    },
    holdings: [
        {
            name: String,
            amount: Number,
            buyin: Number,
        },
    ],
});

userSchema.pre('save', async function(next) {
    // Hash the password before saving the user model
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

userSchema.statics.makeDeposit = async (email, amount) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: 'No user' });
    }
    user.money = user.money + +amount;

    user.save();

    return user;
};

userSchema.statics.makeOrder = async (email, type, company, price, amount) => {
    price = parseFloat(price);
    amount = Number(amount);
    // console.log(price);
    // console.log(amount);
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: 'No user' });
    }
    if (type == 'buy' && user.money < price * amount) {
        return res.status(500).send({ message: 'Not enough money available on the account' });
    }

    let found = false;
    user.holdings.forEach(stock => {
        if (stock.name == company) {
            if (type == 'sell' && stock.amount < 1) {
                return res
                    .status(500)
                    .send({ message: 'You have no stocks in this company to sell' });
            }
            if (type == 'buy') {
                stock.amount += amount;
                stock.buyin += price * amount;
                user.money -= price * amount;
            }
            if (type == 'sell') {
                stock.amount -= amount;
                stock.buyin -= price * amount;
                user.money += price * amount;
            }

            found = true;
        }
    });
    if (!found && type == 'buy') {
        user.holdings.push({
            name: company,
            amount: amount,
            buyin: price * amount,
        });
        user.money -= price * amount;
    }

    user.holdings = user.holdings.filter(stock => {
        return stock.amount > 0;
    });

    user.save();

    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
