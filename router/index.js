const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const passport = require('passport');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn();

var env;

initEnv = function () {
    env = {
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
    }
};

router.get('/callback',
    passport.authenticate('auth0', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect(req.session.returnTo || '/');
    });

router.get('/', ensureLoggedIn, function (req, res, next) {
    req.db.get('users').find({}, {}, function (e, result) {
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
    initEnv();
    res.render('noauth/login',  { env: env })
});

router.post('/login', function (req, res, next) {

});

router.post('/logout', function (req, res, next) {

});

router.post('/add', ensureLoggedIn, function (req, res, next) {
    var db = req.db;
    var dbUsers = db.get("users");

    dbUsers.insert(
        {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name
        },
        function (err, doc) {
            if (err) {
                res.send("Something went wrong.");
            } else {
                res.redirect("/");
            }
        })
});

router.post('/remove', ensureLoggedIn, function (req, res, next) {
    req.db.get("users").remove(
        {
            _id: new mongodb.ObjectID(req.body.user_id)
        },
        function (err, result) {
            if (err) {
                res.sendStatus(400);
            } else {
                res.sendStatus(200);
            }
        });
});

module.exports = router;