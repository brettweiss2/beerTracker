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
            if (req.session.user.id === req.params.id) {
                res.redirect('/dashBoard');
                return;
            }
            const currUser = await userData.getUser(req.session.user.id);
            let isFollowing = false;
            for (let i = 0; i < currUser.following.length; i++) {
                if (currUser.following[i] === req.params.id) isFollowing = true;
            }
            res.render('dashboard/indexLogged',
            {
                firstName: user.firstName,
                id: user._id,
                lastName: user.lastName,
                city: user.city,
                state: user.state,
                country: user.country,
                favoriteBeers: favoriteBeers,
                reviews: reviews,
                following: following,
                isFollowing: isFollowing,
                isOtherUser: true
            });
        }

    } catch (e) {
        res.status(404).json({ message: e}); 
    }
});

router.post('/:id/follow', async (req, res) =>{
    try {
        if(!req.session.user)
            res.redirect('/user/' + req.params.id);
        else {
            const user = await userData.getUser(req.session.user.id);
            let following = user.following;
            if (!following.includes(req.params.id)) {
                following.push(req.params.id);
                await userData.updateUser(req.session.user.id, {following: following});
            }   
        }
        res.redirect('/user/' + req.params.id);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

router.post('/:id/unfollow', async (req, res) =>{
    try {
        if(!req.session.user)
            res.redirect('/user/' + req.params.id);
        else {
            const user = await userData.getUser(req.session.user.id);
            let following = user.following;
            if (following.includes(req.params.id)) {
                const index = following.indexOf(req.params.id);
                if (index !== -1) following.splice(index, 1);
                await userData.updateUser(req.session.user.id, {following: following});
            }   
        }
        res.redirect('/user/' + req.params.id);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

module.exports = router;