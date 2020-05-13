const express = require('express');
const router = express.Router();
const data = require('../data');
const beerData = data.beers;
const userData = data.users;
const reviewData = data.reviews;
const xss = require('xss');

async function getRecommendedBeers(userId) {
	const user = await userData.getUser(userId);
	let reviews = [];
	for (let i = 0; i < user.reviews.length; i++)
		reviews.push(await reviewData.getReview(user.reviews[i]));
	if (reviews.length == 0) return [];
	reviews.sort((a,b)=>(a.rating < b.rating) ? 1 : -1);

	let allBeers = await beerData.getAllBeers();
	for (let i = 0; i < reviews.length; i++) {
		allBeers = allBeers.filter(a => a._id.toString() !== reviews[i].beer);
	}
	
	let i = 0;
	let topBeers = [];
	while (reviews[i].rating > 3.5 && i < 4) {
		topBeers.push(await beerData.getBeer(reviews[i].beer));
		i++;
	}
	if (topBeers.length == 0) {
		topBeers.push(await beerData.getBeer(reviews[0].beer));
	}

	let scores = [];

	for (let j = 0; j < allBeers.length; j++) {
		scores.push({beer: allBeers[j], score: 0});
	}

	for (let j = 0; j < scores.length; j++) {
		for (let k = 0; k < topBeers.length; k ++) {
			if (topBeers[k].type === scores[j].beer.type) {
				scores[j].score += 3;
			}
			for (let x = 0; x < topBeers[k].hops.length; x++) {
				for (let y = 0; y < scores[j].beer.hops.length; y++) {
					if (topBeers[k].hops[x] === scores[j].beer.hops[y])
						scores[j].score += 1;
				}
			}
			for (let x = 0; x < topBeers[k].malt.length; x++) {
				for (let y = 0; y < scores[j].beer.malt.length; y++) {
					if (topBeers[k].malt[x] === scores[j].beer.malt[y])
						scores[j].score += 1;
				}
			}
		}
	}

	scores.sort((a,b)=>(a.score < b.score) ? 1 : -1);
	const recommended = scores.slice(0,8);
	
	const set = new Set(recommended);

	return [...set];
}

async function getSimilarBeers(beerId) {
	const beer = await beerData.getBeer(beerId);
	let allBeers = await beerData.getAllBeers();
	allBeers = allBeers.filter(a => a._id.toString() !== beerId);

	let scores = [];

	for (let i = 0; i < allBeers.length; i++) {
		scores.push({beer: allBeers[i], score: 0});
	}

	for (let j = 0; j < scores.length; j++) {
		if (beer.type === scores[j].beer.type) {
			scores[j].score += 3;
		}
		for (let x = 0; x < beer.hops.length; x++) {
			for (let y = 0; y < scores[j].beer.hops.length; y++) {
				if (beer.hops[x] === scores[j].beer.hops[y])
					scores[j].score += 1;
			}
		}
		for (let x = 0; x < beer.malt.length; x++) {
			for (let y = 0; y < scores[j].beer.malt.length; y++) {
				if (beer.malt[x] === scores[j].beer.malt[y])
					scores[j].score += 1;
			}
		}
	}

	scores.sort((a,b)=>(a.score < b.score) ? 1 : -1);
	const similar = scores.slice(0,6);
	
	const set = new Set(similar);

	return [...set];
}

router.post('/beersList/search',async (req, res) =>{
	search = req.body;
	beerName = xss(search.beer_search)
	HasSearch_error = false;
	search_error = [];
	try{
		const beerProd = await beerData.getBeerByName(beerName);
		if(!req.session.user){
			res.render('beersList/index',{
				searchResult: true,
				id: beerProd._id,
				name: beerProd.name,
				type: beerProd.type,
				abv: beerProd.abv,
				malt: beerProd.malt,
				hops: beerProd.hops
			})
		}else {
			const recommended = await getRecommendedBeers(req.session.user.id);
			res.render('beersList/indexLogged',{
				searchResult: true,
				id: beerProd._id,
				name: beerProd.name,
				type: beerProd.type,
				abv: beerProd.abv,
				malt: beerProd.malt,
				hops: beerProd.hops,
				recommended: recommended
			});
		}
	}catch (e){
		search_error.push("Can not find that one you search, try another")
		HasSearch_error = true;
		if(!req.session.user){
			res.render('beersList/index',{
				HasSearch_error : true,
				search_error : search_error
			})
		}else {
				const recommended = await getRecommendedBeers(req.session.user.id);
				res.render('beersList/indexLogged',{
					HasSearch_error : true,
					search_error : search_error,
					recommended: recommended
				});
			}
	}
});

router.get('/beersList',async(req, res) =>{
	const beerList = await beerData.getAllBeers();

	if(!req.session.user){
		res.render('beersList/index',{beers: beerList})
	}else {
		const recommended = await getRecommendedBeers(req.session.user.id);
		res.render('beersList/indexLogged',
			{
				beers: beerList, 
				recommended: recommended
			});
	}
});

//get specific one with that id
router.get('/beersList/:id', async (req, res) =>{
    try{
		let beer = await beerData.getBeer(req.params.id);
		for (let i = 0; i < beer.comments.length; i++) {
			const user = await userData.getUser(beer.comments[i].user);
			beer.comments[i].user = user;
		}

		const similar = await getSimilarBeers(req.params.id);
		let rating = await reviewData.getBeerAvgRating(req.params.id);
		const hasRating = !(rating === -1);
		rating = rating.toFixed(1);

		if(!req.session.user)
			res.render('beerPage/index',{beer: beer, similar: similar, hasRating: hasRating, rating: rating});
		else {
			const currUser = await userData.getUser(req.session.user.id);
			let isFavorite = false;
			for (let i = 0; i < currUser.favoriteBeers.length; i++) {
				if (currUser.favoriteBeers[i] === req.params.id) isFavorite = true;
			}
			res.render('beerPage/indexLogged',{beer: beer, similar: similar, isFavorite: isFavorite, hasRating: hasRating, rating: rating});
		}
    } catch(e){
       res.status(404).json({ error: e });
    }
});

router.post('/beersList/:id/review', async (req, res) =>{


	try {
		if(!req.session.user)
			res.status(401).redirect('/beers/beersList/' + req.params.id);
		else {
			const rating = xss(req.body.rating);
			const review = xss(req.body.review);

			if (!rating) {
				res.status(400).json({error: "no rating supplied"});
				return;
			}
			if (!review) {
				res.status(400).json({error: "no review supplied"});
				return;
			}

			await reviewData.addReview(req.session.user.id, req.params.id, Number(rating), review);

			res.redirect('/dashBoard');
		}
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post('/beersList/:id/comment', async (req, res) =>{
	try {
		if(!req.session.user)
			res.status(401).redirect('/beers/beersList/' + req.params.id);
		else {
			const comment = xss(req.body.comment);

			if (!comment) {
				res.status(400).json({error: "no comment supplied"});
				return;
			}

			await beerData.addComment(req.params.id, req.session.user.id, comment);

			res.redirect('/beers/beersList/' + req.params.id);
		}
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post('/beersList/:id/favorite', async (req, res) =>{
	try {
        if(!req.session.user)
            res.status(401).redirect('/beers/beersList/' + req.params.id);
        else {
            const user = await userData.getUser(req.session.user.id);
            let favorites = user.favoriteBeers;
            if (!favorites.includes(req.params.id)) {
                favorites.push(req.params.id);
                await userData.updateUser(req.session.user.id, {favoriteBeers: favorites});
            }   
        }
        res.redirect('/beers/beersList/' + req.params.id);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

router.post('/beersList/:id/unfavorite', async (req, res) =>{
	try {
        if(!req.session.user)
            res.status(401).redirect('/beers/beersList/' + req.params.id);
        else {
            const user = await userData.getUser(req.session.user.id);
            let favorites = user.favoriteBeers;
            if (favorites.includes(req.params.id)) {
                const index = favorites.indexOf(req.params.id);
                if (index !== -1) favorites.splice(index, 1);
                await userData.updateUser(req.session.user.id, {favoriteBeers: favorites});
            }   
        }
        res.redirect('/beers/beersList/' + req.params.id);
    } catch(e) {
        res.status(500).json({message: e});
    }
});

module.exports=router;