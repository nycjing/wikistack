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
});

router.get('/search', function (req, res, next) {
    var tags = [];
    Page.findAll()
        .then(function (pages) {
            pages.map(function (page) {
               return tags = tags.concat(page.tags);
            });
            tags = Array.from(new Set(tags));
            res.render('tags',{tags});
        })
});

router.get('/search/:tag', function (req, res, next) {
    console.log(req.params.tag);
    const tag = req.params.tag;
    Page.findByTag(tag)
        .then(function (pages) {
            res.render('index', {pages});
        })
        .catch(next);
});

router.post('/', function (req, res, next) {

    // STUDENT ASSIGNMENT:
    // add definitions for `title` and `content`
    const pageTitle = req.body.title;
    const pageContent = req.body.content;
    const pageStatus = req.body.status;
    const pageTags = req.body.tags;

    User.findOrCreate({
        where: {
            name: req.body.name,
            email: req.body.email,
        }
    })
        .then(function (values) {
            const user = values[0];
            const page = Page.build({
                title: pageTitle,
                content: pageContent,
                status: pageStatus,
                tags: pageTags,
            });
            return page.save().then(function (page) {
                return page.setAuthor(user);
            });
        })
        .then(function (page) {
            res.redirect(page.route);
        })
        .catch(next);

    // STUDENT ASSIGNMENT:
    // make sure we only redirect *after* our save is complete!
    // note: `.save` returns a promise or it can take a callback.
    // -> after save -> res.redirect('/');


});

router.get('/add', function (req, res, next) {
    res.render('addpage');
});

router.get('/:urlTitle', function (req, res, next) {
    // res.send('hit dynamic route at ' + req.params.urlTitle);
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        },
        include: [
            {model: User, as: "author"}
        ]
    })
        .then(function (page) {
            // res.json(foundPage);a
            if (page === null) {
                res.status(404).send();
            } else {

                res.render('wikipage', {page});
            }
        })
        .catch(next);

});

router.get('/:urlTitle/delete', function (req, res, next) {

    Page.destroy({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
        .then(function () {
                res.redirect('/wiki');
        })
        .catch(next);
});

router.get('/:urlTitle/similar', function (req, res, next) {
    // res.send('hit dynamic route at ' + req.params.urlTitle);
    Page.findOne({
        where: {
            urlTitle: req.params.urlTitle
        }
    })
        .then(function (page) {
            // res.json(foundPage);a
            if (page === null) {
                res.status(404).send();
            } else {
                return page.findSimilar()
                    .then(function(pages){
                        res.render('index', {pages});
                    });
            }
        })
        .catch(next);

});