const express = require('express');
const router = express.Router();
const passports = require('passport');
const jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
const FacebookStrategy = require('passport-facebook').Strategy;

const AuthRoutes = require('./../middlewares/AuthRoute');
const CheckData = require('./../middlewares/CheckData');

const User = require('./../models/User.js');

router.post('/checkUsernameExists', function(req, res) {

    var username = req.body.username

    res.json({
        result: true
    })

})


router.get('/facebook',
    passport.authenticate('facebook')

);

router.get('/facebook/callback', function(req, res) {
    res.status(200);
    res.json({
        result: 'A Pas Marché !'
    })
});

router.post('/signup', CheckData, function(req, res) {

    // find the user
    var mail = req.body.mail
    var password = req.body.password
    var username = req.body.username

    User.findOrCreate({

            where: {
                mail: mail,
                username: username,
                password: password
            }
        }).spread(function(data, created) {

            if (created) {
                res.status(200).json({
                    result: 'User ' + mail + ' added in DB !'
                })
            } else {
                res.status(403)
                res.json({
                    result: mail + " already exists"
                })
            }


        }).catch(function(error) {
            res.status(500)
            res.json({
                result: 'Error while adding the member',
                errorDB: error,
                stackError: error.stack
            })
        });
});

router.post('/signin', CheckData, function(req, res) {

    var mail = req.body.mail
    var password = req.body.password

    console.log("Je tente : " + req.body.mail)
    //console.log(password)

    User.findOne({
        where: {
            mail: mail
        }
    }).then(function(user) {

        if (user.get('password') != password) {

            res.status(403)
            res.json({
                result: false,
                message: 'Authentication failed. Wrong user or password'
            })

        } else {

            var token = jwt.sign({
                id: user.get('id'),
                username: user.get('username')
            }, router.get('superSecret'), {
                expiresIn: '7d' // expires in 24 hours
            })

            // return the information including token as JSON
            res.status(200).json({
                result: true,
                token: token
            })

        }

    }).catch(function(error) {

        res.status(500)
        res.json({
            status: false,
            result: 'Internal Error'
        })

    })
})

router.get('/me', AuthRoutes, function(req, res) {

    var id = req.decoded.id

    User.findOne({
        where: {
            id: id
        }
    }).then(function(user) {

        res.status(200)
        res.json({
            id: user.get('id'),
            username: user.get('username'),
            mail: user.get('mail'),
            createdAt: user.get('createdAt')
    })

    }).catch(function(err) {

        res.status(500)
        res.json({
            result: "An error occurred",
            error: err,
            stackError: err.stack
        })

    })
})

module.exports = router;