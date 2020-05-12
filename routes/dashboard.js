const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const beerData = data.beers;
const reviewData = data.reviews;

router.get('/', async(req,res) => {
    if(!req.session.user){
        res.render('home/index');
    } else {
        const user = await userData.getUser(req.session.user.id);

        let favoriteBeers = [];
        for (let i = 0; i < user.favoriteBeers.length; i++) {
            favoriteBeers.push(await beerData.getBeer(user.favoriteBeers[i]));
        }

        let reviews = [];
        for (let i = 0; i < user.reviews.length; i++) {
            reviews.push(await reviewData.getReview(user.reviews[i]));
        }
        for (let i = 0; i < reviews.length; i++) {
            reviews[i].beer = await beerData.getBeer(reviews[i].beer);
        }

        let following = [];
        for (let i = 0; i < user.following.length; i++) {
            following.push(await userData.getUser(user.following[i]));
        }
    
        res.render('dashboard/indexLogged',
        {
            firstName: req.session.user.firstName,
            lastName: req.session.user.lastName,
            city: req.session.user.city,
            state: req.session.user.state,
            country: req.session.user.country,
            favoriteBeers: favoriteBeers,
            reviews: reviews,
            following: following
        });
    }
});

module.exports = router;