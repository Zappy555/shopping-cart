const express = require('express');
const router = express.Router();

//Import page model
const Page = require('../models/page.js')

//Get pages index
router.get('/', function(req, res) {
    res.send('Admin area');
});

//Get add page
router.get('/add-page', function(req, res) {
    const title = "";
    const slug = "";
    const content = "";

    res.render('admin/add_page', {
        title: title,
        slug: slug,
        content: content
    });
});


//Post add page
const { check, validationResult } = require('express-validator/check')

router.post('/add-page', function(req, res) {

    let title = req.body.title;
    let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") {
        slug = title.replace(/\s+/g, '-').toLowerCase();
    }
    let content = req.body.content;

    req.checkBody('title', 'Title must not be empty').notEmpty();
    req.checkBody('content', 'Content must not be empty').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('admin/add_page', {
            errors: errors,
            title: title,
            slug: slug,
            content: content
        });
    } else {
        Page.findOne({ slug: slug }, function(err, page) {
            if (page) {
                req.flash('alert-danger', 'page already exist');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                let page = new Page({
                    title: title,
                    slug: slug,
                    content: content,
                    sorting: 0
                });

                page.save(function(err) {
                    if (err) return console.log(err);

                    req.flash('alert-success', 'Page added!');
                    res.redirect('/admin/pages')
                });
            }
        });
    }
});

//exporting router
module.exports = router;