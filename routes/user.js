'use strict';
const express = require ('express');
const router = express.Router();
module.exports = router;

router.get('/', function(req, res, next) {
    res.send('got to GET /user/');
});

router.post('/', function(req, res, next) {
    res.send('got to POST /user/');
});

router.get('/add', function(req, res, next) {
    res.send('got to GET /user/add');
});