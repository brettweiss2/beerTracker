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
                    error='The email or password you enter is wrong, try again'
                    res.status(401).render('signUpLogin',{
                    hasErrors: true,
                    errors: error
                    })
                }
    
        }
    }catch(e){ 
        error='The email or password you enter is wrong, try again'
        res.status(401).render('signUpLogin',{
            hasErrors: true,
		    errors: error
	    })
        }


	
})




router.post('/signUp', async(req,res) =>{
    const{email,password,firstName,lastName,city,state,country} = req.body;
    errors = [];
    try{
        try{
            let user = await userData.getUserByEmail(email);
            if(user){
                e = "This email has been registered"
                res.status(401).render('signUpLogin',{
                    errors: e,
                    hasErrors: true,

                })
            }
        }catch(e){
            const hassPassword = await bcrypt.hash(password,saltRounds)
            let newUser = await userData.addUser(email,hassPassword,firstName,lastName,city,state,country);
            req.session.user={
                id: newUser['id'],
                email: newUser['email']
            }
            res.redirect('http://localhost:3000/dashBoard')
        }

    }catch(e){
        res.redirect('/')

    }

})
router.get('/logout',async(req,res) =>{
    req.session.destroy();
    res.redirect('/')
})


module.exports = router;