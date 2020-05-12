const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const beerData = data.beers;

router.get('/', async(req,res) => {
    if(!req.session.user){
        res.render('home/index');
    } else {
        const user = await userData.getUser(req.session.user.id);
        let favoriteBeers = [];
        for (let i = 0; i < user.favoriteBeers.length; i++) {
            favoriteBeers.push(await beerData.getBeer(user.favoriteBeers[i]));
        }
    
        res.render('dashboard/index',
        {
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName,
            city: req.session.user.city,
            state: req.session.user.state,
            country: req.session.user.country,
            favoriteBeers: favoriteBeers
        });
    }
});

module.exports = router;