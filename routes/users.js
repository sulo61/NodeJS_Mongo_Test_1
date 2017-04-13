var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

router.get('/', function (req, res, next) {
    req.db.get('users').find({}, {}, function (e, result) {
        res.render('list', {
            usersList: result,
            title: "List of Users"
        });
    });
});

router.get('/add', function (req, res, next) {
    res.render('add', {title: "Add new User"})
});

router.post('/add', function (req, res, next) {
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

router.post('/remove', function (req, res, next) {
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