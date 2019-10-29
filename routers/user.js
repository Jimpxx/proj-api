const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({ message: 'Root' });
});

router.post('/register', async (req, res) => {
    console.log(req.body);
    const user = new User(req.body);

    await user
        .save()
        .then(savedUser => {
            return res.status(200).send(savedUser);
        })
        .catch(err => {
            return res.status(500).send();
        });
});

router.post('/login', async (req, res) => {
    //Login a registered user
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        throw new Error({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res.status(200).send({ user, token });
});

router.post(
    '/deposit',
    (req, res, next) => checkToken(req, res, next),
    async (req, res) => {
        console.log(req.body);
        const email = req.body.email;
        const amount = req.body.amount;
        const user = await User.makeDeposit(email, amount);
        return res.status(200).send(user);
    },
);

router.post(
    '/order',
    (req, res, next) => checkToken(req, res, next),
    async (req, res) => {
        console.log(req.body);
        const email = req.body.email;
        const type = req.body.type;
        const company = req.body.company;
        const price = req.body.price;
        const amount = req.body.amount;
        const user = await User.makeOrder(email, type, company, price, amount);
        return res.status(200).send(user);
    },
);

function checkToken(req, res, next) {
    const token = req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            // send error response
            console.log('Token INVALID');
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: '/reports',
                    title: 'JWT Error',
                    detail: err.message,
                },
            });
        }
        console.log('Token valid!');
        // Valid token send on the request
        next();
    });
}

module.exports = router;
