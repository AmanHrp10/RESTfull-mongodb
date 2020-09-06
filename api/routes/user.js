const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

router.post('/signup', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if(user.length >= 1) {
            res.status(409).json({
                message: 'Email exists'
            });
        }else{
            bcrypt.hash(req.body.password,10, (err, result) => {
                const user = new User({
                    email: req.body.email,
                    password: result
                });
                user
                .save()
                .then(result => {
                    if(result){
                        console.log(result)
                        res.status(200).json({
                            message: 'User created'
                        })
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    })
                })
                    
            })
        }
    })
})

router.post('/login', (req, res, next) => {
    User.find({email: req.body.email})
    .exec()
    .then(user => {
        if (user.length < 1){
            return res.status(401).json({
                message: 'Auth failed'
            })
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                        message: 'Auth failed'
                    });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                },
                    "secret",
                        {
                        expiresIn: '1h'
                    }
                );
                return res.status(200).json({
                    message: 'Auth successfull',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Auth failed'
            });
        });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})

router.delete('/:userId', (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'User deleted'
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})
module.exports = router