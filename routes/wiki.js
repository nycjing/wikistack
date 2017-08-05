'use strict';
const express = require('express');
const router = express.Router();
module.exports = router;
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', function (req, res, next) {
    Page.findAll()
        .then(function (pages) {
            // res.json(foundPage);a
            res.render('index', {pages});
        })
        .catch(next);
})
    ;

    router.post('/', function (req, res, next) {

        // STUDENT ASSIGNMENT:
        // add definitions for `title` and `content`
        var pageTitle = req.body.title;
        var pageContent = req.body.content;
        var pageStatus = req.body.status;

        var page = Page.build({
            title: pageTitle,
            content: pageContent,
            status: pageStatus
        });

        // STUDENT ASSIGNMENT:
        // make sure we only redirect *after* our save is complete!
        // note: `.save` returns a promise or it can take a callback.
        // -> after save -> res.redirect('/');
        page.save()
            .then(function (savedPage) {
                res.redirect(savedPage.route); // route virtual FTW
            }).catch(next);


    });

    router.get('/add', function (req, res, next) {
        res.render('addpage');
    });

    router.get('/:urlTitle', function (req, res, next) {
        // res.send('hit dynamic route at ' + req.params.urlTitle);
        Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            }
        })
            .then(function (page) {
                // res.json(foundPage);a
                res.render('wikipage', {page});
            })
            .catch(next);

    });