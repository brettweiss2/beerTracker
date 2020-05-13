const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const beerData = data.beers;
const reviewData = data.reviews;

router.get('/:id', async(req,res) => {
    try { 
        const user = await userData.getUser(req.params.id);
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

        if(!req.session.user){
            res.render('dashboard/index',
            {
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                state: user.state,
                country: user.country,
                favoriteBeers: favoriteBeers,
                reviews: reviews,
                following: following
            });
        }

        else {
            res.render('dashboard/indexLogged',
            {
                firstName: user.firstName,
                lastName: user.lastName,
                city: user.city,
                state: user.state,
                country: user.country,
                favoriteBeers: favoriteBeers,
                reviews: reviews,
                following: following
            });
        }

    } catch (e) {
        res.status(404).json({ message: e}); 
    }
});

module.exports = router;