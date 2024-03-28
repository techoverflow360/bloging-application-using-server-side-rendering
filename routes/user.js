const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/signin', (req, res) => {
    return res.render('signin');
})

router.get('/signup', (req, res) => {
    return res.render('signup');
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName, email, password
    });
    return res.redirect('/');
})

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.matchPassword(email, password);
        return res.redirect('/');
    }catch(err){
        console.log(err);
        return res.redirect('/user/signin');
    }
})

module.exports = router;
