const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./router/index');
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('mongodb://admin:admin@ds159880.mlab.com:59880/nodejs-mongo-test-1-db');
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const strategy = new Auth0Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
}, function (accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
});
const app = express();

setupPassport();
setupApp();

function setupPassport() {
    passport.use(strategy);
    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}

function setupApp() {
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function (req, res, next) {
        req.db = db;
        next();
    });

    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());


    app.use('/', routes);

    // errors
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        res.status(err.status || 500);
        res.render('error');
    });
}

module.exports = app;