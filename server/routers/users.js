const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const bcrypt = require('bcrypt')
const { issueToken } = require('../../passport-config')
const passport = require('passport')


router.get("/test", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).send({ msg: 'you are authorized' })

});

router
    .route('/create')
    .post(async(req, res) => {
        try {
            await bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    console.error('Hash Error:', err)
                }
                req.body.password = hash
                User.create(req.body)
                    .then((user) => {
                        const jwt = issueToken(user)
                        res.status(200).send({ token: jwt.token, expiresIn: jwt.expiresIn })
                    })
                    .catch(err => {
                        if (err.keyValue.email) {
                            res.status(400).send({ errorMessage: `The following email already exists: ${err.keyValue.email}.  If Facebook account was used to create account, please select Facebook Login` })
                        } else if (err.keyValue.username) {
                            res.status(400).send({ errorMessage: `The following username already exists: ${err.keyValue.username}` })
                        } else {
                            res.status(400).send(err)
                        }
                    })
            })
        } catch (err) {
            console.error(err)
        }
    })

router
    .route('/login')
    .post((req, res) => {
        if (req.user) {
            res.status(200).send(req.user);
        }
        const { email, password } = req.body
        User.findOne({ email })
            .then(async(user) => {
                console.log(user)
                if (!user) {
                    res.status(400).send({ errorMessage: `Could not find user with the following email: ${email}` })
                }
                const passwordMatch = await bcrypt.compare(password, user.password)

                if (passwordMatch) {
                    const jwt = issueToken(user)
                    res.status(200).send({ token: jwt.token, expires: jwt.expires })
                } else {
                    res.status(400).send({ errorMessage: 'incorrect password' })
                }
            })
            .catch((err) => res.status(400).send(err))
    })

module.exports = router;