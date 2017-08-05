'use strict';
const express = require ('express');
const router = express.Router();
module.exports = router;
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function(req, res, next) {
    res.redirect('/');
});

router.post('/', function(req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    var pageTitle = req.body.title;
    var pageContent = req.body.content;

    var page = Page.build({
        title: pageTitle,
        content: pageContent
    });

    // STUDENT ASSIGNMENT:
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise or it can take a callback.
    page.save();
    // -> after save -> res.redirect('/');
    res.redirect('/');
});

router.get('/add', function(req, res, next) {
    res.render('addpage');
});