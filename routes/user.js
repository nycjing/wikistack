'use strict';
const express = require('express');
const router = express.Router();
module.exports = router;
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function (req, res, next) {
    User.findAll()
        .then(function (users) {
            // res.json(foundPage);a
            res.render('userpage', {users});
        })
        .catch(next);
});


router.get('/:id', function(req, res, next) {
    const userPromise = User.findById(req.params.id);
    const pagesPromise = Page.findAll({
        where: { authorId : req.params.id}
    });
    Promise.all([userPromise, pagesPromise])
        .then(function(values){
            res.render('user',{user:values[0],pages:values[1]})
        })
        .catch(next);

});

router.get('/add', function(req, res, next) {
    res.send('got to GET /user/add');
});