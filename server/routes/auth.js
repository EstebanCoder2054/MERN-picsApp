const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const requireLogin = require('../middleware/requireLogin');

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    if(!email || !password || !name){
        return res.status(422).json({error: 'please add all the fields'})
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if(savedUser){
                return res.status(422).json({error: 'the user already exists with that email'});
            }
            bcrypt.hash(password, 12)
                    .then(hashedpassword => {
                        const user = new User({
                            email,
                            password: hashedpassword,
                            name
                        });
            
                        user.save()
                            .then(user => {
                                res.status(200).json({ message: 'user saved successfuly' })
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    })
                    .catch(error => {
                        console.log(error);
                    })
        })
        .catch(error => {
            console.log(error);
        })
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(422).json({
            error: 'please provide an email and password'
        });
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if(!savedUser){
                return res.status(422).json({
                    error: 'Invalid email or password'
                });
            }
            bcrypt.compare(password, savedUser.password)
                    .then(doMatch => {
                        if(doMatch){
                            // res.status(200).json({
                            //     message: 'successfuly signed in'
                            // })

                            // registrando un TOKEN
                            const token = jwt.sign({
                                _id: savedUser._id
                            },
                                JWT_SECRET
                            )
                            const { _id, name, email } = savedUser;
                            res.status(200).json({
                                token,
                                user: {
                                    _id,
                                    name,
                                    email
                                }
                            })

                        }else{
                            return res.status(422).json({
                                error: 'Invalid email or [password]'
                            })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
        })
        .catch(error => {
            console.log(error);
        })
})

module.exports = router;