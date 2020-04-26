let express = require('express');
let path = require('path');
let app = express();
const mongoose = require("mongoose");
const passport = require('passport')
const { customStrategy } = require('../passport-config')
const FacebookStrategy = require('passport-facebook')
var https = require('https')
var fs = require('fs')

const port = process.env.PORT || 3000;

// server api routes
const users = require('./routers/users.js');
const itinerary = require('./routers/itinerary.js');
const yelp = require('./routers/yelp.js');
const facebook = require('./routers/facebook.js')

//mongo database URI string
// const db = require('../config/keys.js').mongo_uri;

//passport configuration and initialization
customStrategy(passport)
app.use(passport.initialize());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

// use your routers here
app.use("/users", users);
app.use("/itinerary", itinerary);
app.use("/yelp", yelp);
app.use("/facebook", facebook);




mongoose
    .connect(process.env.MONGODB_URI || process.env.MONGO_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


var certOptions = {
    key: fs.readFileSync(path.resolve('config/server.key')),
    cert: fs.readFileSync(path.resolve('config/server.crt'))
}

//for Heroku deployment
if (process.env.NODE_ENV === 'production') {
    /**
     * -----------Unsecure server--------------
     */
    app.listen(port, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Unsecured Server is listening on port ${port}`);
        }
    })
} else {
    /**
     * -----------Secure server--------------
     */
    https.createServer(certOptions, app)
        .listen(port, () => console.log(`Secured Server is listening on port ${port}`))
}

//if not deployed and without SSL, comment out the following code:
// app.listen(port, (err) => {
//   if (err) {
//       console.log(err);
//   } else {
//       console.log(`Unsecured Server is listening on port ${port}`);
//   }
// })







/**
 * ---How to set up ssl certificate for localhost---
 */
//https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/
/**
 * ---import rootCA for pc---
 */
//https://www.sslsupportdesk.com/how-to-enable-or-disable-all-puposes-of-root-certificates-in-mmc/