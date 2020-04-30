const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const data = require('../data');
const userData = data.users;
const saltRounds = 12;



router.get('/', async(req,res) => {
	if(!req.session.user){
		res.render('signUpLogin/index')
	}else(res.redirect('http://localhost:3000/userProfile'))
});

router.post('/login', async (req,res) => {
	const {email, password} = req.body;
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
                    return res.redirect('http://localhost:3000/userProfile')
                }else{
                    error='The email or password you enter is wrong, try again'
                    res.status(401).render('signUpLogin',{
                    error: error
                    })
                }
    
        }
    }catch(e){ 
        error='The email or password you enter is wrong, try again'
        res.status(401).render('signUpLogin',{
		error: error
	    })
        }


	
})




router.post('/signUp', async(req,res) =>{
    const{email,password,firstName,lastName,city,state,country} = req.body;
    try{
        try{
            let user = await userData.getUserByEmail(email);
            if(user){
                console.log("the email is already registered")
                res.redirect('/')
            }
        }catch(e){
            const hassPassword = await bcrypt.hash(password,saltRounds)
            let newUser = await userData.addUser(email,hassPassword,firstName,lastName,city,state,country);
            req.session.user={
                id: newUser['id'],
                email: newUser['email']
            }
            res.redirect('http://localhost:3000/userProfile')
        }

    }catch(e){
        res.redirect('/')

    }



    router.get('/logout',async(req,res) =>{
        req.session.destroy();
        res.redirect('/')
    })



})


module.exports = router;