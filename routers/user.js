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

    // Create a new user
    // try {
    //     const user = new User(req.body);
    //     await user.save();
    //     const token = await user.generateAuthToken();
    //     res.status(201).send({ user, token });
    // } catch (error) {
    //     res.status(400).send(error);
    // }
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
    // user.tokens = user.tokens.concat({ token });

    return res.status(200).send({ user, token });

    // try {
    //     const { email, password } = req.body;
    //     // const email = req.body.email;
    //     // const password = req.body.password;
    //     console.log('Before');
    //     const user = await User.findByCredentials(email, password);
    //     console.log('after');
    //     if (!user) {
    //         return res
    //             .status(401)
    //             .send({ error: 'Login failed! Check authentication credentials' });
    //     }
    //     const token = await user.generateAuthToken();
    //     res.send({ user, token });
    // } catch (error) {
    //     res.status(400).send(error);
    // }
});

router.post('/deposit', async (req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const amount = req.body.amount;
    const user = await User.makeDeposit(email, amount);
    return res.status(200).send(user);
});

module.exports = router;
