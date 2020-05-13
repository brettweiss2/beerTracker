const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const userData = data.users;
const saltRounds = 12;
const xss = require('xss');

router.get('/', async(req,res) => {
	if(!req.session.user){
		res.render('signUpLogin/index')
	}else(res.status(401).redirect('/dashBoard'))
});

router.post('/login', async (req,res) => {
    // const {emailXss, passwordXss} = req.body;
    email = xss(req.body.email);
    password = xss(req.body.password);


    errors=[];
    try{
        let user = await userData.getUserByEmail(email);
        if(user["email"]==email){
            const hashCode = user["hashedPassword"]
            let match = await bcrypt.compare(password,hashCode)
            if(match){
                req.session.user = {
                    id: user["_id"],
                    email: user["email"],
                    firstName: user.firstName,
                    lastName: user.lastName,
                    city: user.city,
                    state: user.state,
                    country: user.country
                }
                return res.redirect('http://localhost:3000/dashBoard')
            }else{
                errors.push('The email or password you entered is wrong, please try again')
            }
        }
    }catch(e){ 
        errors.push('The email or password you entered is wrong, please try again')
    }

    if (errors.length > 0) {
        res.render('signUpLogin/index', {
            hasErrors: true,
            errors: errors
        });
        return;
    }
});

router.post('/signUp', async(req,res) =>{
    const email = xss(req.body.email);
    const password = xss(req.body.password);
    const firstName = xss(req.body.firstName);
    const lastName = xss(req.body.lastName);
    const city = xss(req.body.city);
    const state = xss(req.body.state);
    const country = xss(req.body.country);
    email_L = email.toLowerCase()
    error = [];

    if(!email_L){
        error.push("Please provied an email")
    }
    if(!password){
        error.push("Please provide a password")
    }
    if(!firstName){
        error.push("Please provide your first name")
    }
    if(!lastName){
        error.push("Please provide your last name")
    }
    if(!city){
        error.push("Please provide your city")
    }
    if(!state){
        error.push("Please provide your state")
    }
    if(!country){
        error.push("Please provide country")
    }

    try{
        let user = await userData.getUserByEmail(email_L);
        if(user){
            error.push("This email has already been registered")

        }}catch(e){
            const hassPassword = await bcrypt.hash(password,saltRounds)
            try{
                let newUser = await userData.addUser(email_L,hassPassword,firstName,lastName,city,state,country);
                req.session.user={
                    id: newUser['id'],
                    email: newUser['email'],
                    firstName: user.firstName,
                    lastName: user.lastName,
                    city: user.city,
                    state: user.state,
                    country: user.country
                }
                res.redirect('http://localhost:3000/dashBoard')}
            catch(e){
                error.push("Registration failed")
            }
        }

    if (error.length > 0) {
        res.render('signUpLogin/index', {
            error: error,
            hasError: true,
        });
        return;
    }
});

router.get('/logout',async(req,res) =>{
    req.session.destroy();
    res.redirect('/')
});

module.exports = router;