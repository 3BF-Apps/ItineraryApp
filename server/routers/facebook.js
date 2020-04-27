const express = require('express');
const router = express.Router();
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const User = require('../models/User.js');
const bcrypt = require('bcrypt')
const { issueToken } = require('../../passport-config')
require('dotenv').config()



const fbOptions = {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'https://localhost:3000/facebook/auth/login',
    // callbackURL: 'https://the-nightout-app.herokuapp.com/facebook/auth/login',
    profileFields: ['emails', 'displayName', 'first_name']
}

const fbCallback = async(accessToken, refreshToken, profile, done) => {
    const test = await bcrypt.hash(profile._json.id, 10)
    try {
        const existingUser = await User.findOne({ email: profile._json.email });
        console.log('user exists: ', existingUser)
        if (existingUser) {
            return done(null, existingUser)
        } else {

            const newUser = {
                username: `${profile._json.first_name}${profile._json.id.substr(0,5)}`,
                name: profile._json.name,
                email: profile._json.email,
                password: await bcrypt.hash(profile._json.id, 10)
            }
            await User.create(newUser)
                .then((createdUser) => done(null, createdUser))
                .catch(err => console.log('fail', err))
        }
    } catch (err) {
        return done(err, false)
    }
}

passport.use(new FacebookStrategy(fbOptions, fbCallback))

router.get("/login", passport.authenticate('facebook', { scope: ['email'] }));
router.get("/auth/login", passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/'
}), (req, res, next) => {
    const jwt = issueToken(req.user)
    res.cookie('token', jwt.token, { expires: new Date(Date.now() + 10000) });
    res.redirect('https://localhost:3000/');
    // res.redirect('https://the-nightout-app.herokuapp.com/');

});


module.exports = router;