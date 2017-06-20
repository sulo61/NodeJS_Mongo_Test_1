const mongodb = require('mongodb');
const COLLECTION_USERS = "users";
const Db = function () {
    // nothing
};

Db.prototype.getUsers = function (req, callback) {
    req.db.get(COLLECTION_USERS).find({}, {}, function (e, result) {
        callback(result);
    });
};

Db.prototype.addUser = function (req, callback) {
    req.db.get(COLLECTION_USERS).insert(
        {
            "first_name": req.body.first_name,
            "last_name": req.body.last_name
        },
        callback);
};

Db.prototype.removeUser = function (req, callback) {
    req.db.get(COLLECTION_USERS).remove(
        {
            _id: new mongodb.ObjectID(req.body.user_id)
        },
        callback);
};


exports.Db = Db;