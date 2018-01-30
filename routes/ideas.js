const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');



//Load Idea model
require('../models/Idea');
const Idea = mongoose.model('ideas');


//render ideas page
router.get('/', ensureAuthenticated, function(req, res, next) {
    Idea.find({user: req.user.id})
        .sort({ date: 'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas,
                title: 'Ideas',
                bgImage: '../images/shavings.png'
            });
        });
});

// Add idea form
router.get('/add', ensureAuthenticated, function(req, res, next) {    
    res.render('ideas/add', {
        title: 'Ideas',
        bgImage: '../images/shavings.png'
    });
});

// Edit idea form
router.get('/edit/:id', ensureAuthenticated, function(req, res, next) {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if(idea.user != req.user.id){
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea,
                    title: 'Edit',
                    bgImage: '../images/shavings.png'
                });
            }
        })
});

// Process add idea form
router.post('/', ensureAuthenticated, (req,res) => {
    let errors = [];
    if(!req.body.title) {
        errors.push({text:'Please add a title'});
    }
    if(!req.body.details) {
        errors.push({text:'Please add a details'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            detials: req.body.details 
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Project added');
                res.redirect('/ideas');
            })
    }
});

// Process edit idea form
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save(idea => {
                req.flash('success_msg', 'Project updated');
                res.redirect('/ideas');
            })

    })
});

// Process delete idea form
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Project removed');
            res.redirect('/ideas');
        });
});

module.exports = router;
