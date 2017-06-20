const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

const Db = require('../database/index.js').Db;
const db = new Db();

var env;

refreshEnvParams = function () {
    env = {
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
    }
};

router.get('/auth0/callback',
    passport.authenticate('auth0', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect(req.session.returnTo || '/');
    });

router.get('/', ensureLoggedIn, function (req, res, next) {
    db.getUsers(req, function (result) {
        res.render('auth/list', {
            usersList: result,
            title: "List of Users"
        });
    });
});

router.get('/add', ensureLoggedIn, function (req, res, next) {
    res.render('auth/add', {title: "Add new User"})
});

router.get('/login', function (req, res, next) {
    refreshEnvParams();
    res.render('noauth/login', {env: env})
});

router.post('/login', function (req, res, next) {

});

router.post('/logout', function (req, res, next) {

});

router.post('/add', ensureLoggedIn, function (req, res, next) {
    db.addUser(req, function (err, doc) {
        if (err) {
            res.send("Something went wrong.");
        } else {
            res.redirect("/");
        }
    })
});

router.post('/remove', ensureLoggedIn, function (req, res, next) {
    db.removeUser(req, function (err, result) {
        if (err) {
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    })
});

module.exports = router;