const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const userData = data.users;
const saltRounds = 12;



router.get('/', async(req,res) => {
	if(!req.session.user){
		res.render('signUpLogin/index')
	}else(res.redirect('http://localhost:3000/dashBoard'))
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;
    errors=[];
    try{
        let user = await userData.getUserByEmail(email);
        if(user["email"]==email){
            const hashCode = user["hashedPassword"]
            let match = await bcrypt.compare(password,hashCode)
                if(match){
                    req.session.user = {
                        id: user["id"],
                        email: user["email"]
                        }
                    return res.redirect('http://localhost:3000/dashBoard')
                }else{
                    errors.push('The email or password you enter is wrong, try again')
                    console.log("Error1")
                    // res.render('signUpLogin/index',{
                    // hasErrors: true,
                    // errors: errors
                    // })
                    // return;
                }
    
        }
    }catch(e){ 
        errors.push('The email or password you enter is wrong, try again')
        // res.render('signUpLogin',{
        //     hasErrors: true,
		//     errors: error
        // })
        // return;
        }

    
    	if (errors.length > 0) {
            res.render('signUpLogin/index', {
                hasErrors: true,
                errors: errors

    
            });
            return;
        }
	
})




router.post('/signUp', async(req,res) =>{
    const{email,password,firstName,lastName,city,state,country} = req.body;
    error = [];

    if(!email){
        error.push("Please provied email")
    }
    if(!password){
        error.push("Please provide password")
    }
    if(!firstName){
        error.push("Please provide First Name")
    }
    if(!lastName){
        error.push("Please provide Last Name")
    }
    if(!city){
        error.push("Please provide city")
    }
    if(!state){
        error.push("Please provide State")
    }
    if(!country){
        error.push("Please provide country")
    }


    try{
        let user = await userData.getUserByEmail(email);
        if(user){
            error.push("This email has been registered")

        }}catch(e){
            const hassPassword = await bcrypt.hash(password,saltRounds)
            try{
                let newUser = await userData.addUser(email,hassPassword,firstName,lastName,city,state,country);
                req.session.user={
                    id: newUser['id'],
                    email: newUser['email']
                }
                res.redirect('http://localhost:3000/dashBoard')}
            catch(e){
                error.push("Register Failed")
            }
        }


        if (error.length > 0) {
            res.render('signUpLogin/index', {
                error: error,
                hasError: true,
    
            });
            return;
        }})



router.get('/logout',async(req,res) =>{
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;