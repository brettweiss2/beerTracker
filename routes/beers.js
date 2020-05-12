const express = require('express');
const router = express.Router();
const data = require('../data');
const beerData = data.beers;
const reviewData = data.reviews;
const xss = require('xss');

router.get('/beerSubmission',(req, res) =>{
	if(!req.session.user){
		res.render('signUpLogin/index')
	}else(res.render('beerSubmission/indexLogged'))
})

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
		}else(res.render('beersList/indexLogged',{
			searchResult: true,
			id: beerProd._id,
			name: beerProd.name,
			type: beerProd.type,
			abv: beerProd.abv,
			malt: beerProd.malt,
			hops: beerProd.hops
		}))
	}catch (e){
		search_error.push("Can not find that one you search, try another")
		HasSearch_error = true;
		if(!req.session.user){
			res.render('beersList/index',{
				HasSearch_error : true,
				search_error : search_error
			})
		}else(res.render('beersList/indexLogged',{
				HasSearch_error : true,
				search_error : search_error}))
	}
})

router.get('/beersList',async(req, res) =>{
	const beerList = await beerData.getAllBeers(1, 4);

	if(!req.session.user){
		res.render('beersList/index',{beers: beerList})
	}else(res.render('beersList/indexLogged',{beers: beerList}))
})

// get all beers

//get specific one with that id
router.get('/beersList/:id', async (req, res) =>{
    try{
		const review = await reviewData.getAllReviews();
		reviewWithBeer = []
		for (i in(review)){
			if(review[i].beer === req.params.id){
				reviewWithBeer.push(review[i]);
			}
		}
		const beer = await beerData.getBeer(req.params.id);
		if(!req.session.user){
			res.render('beerPage/index',{
				beer: beer,
				reviews: reviewWithBeer})
		}else(res.render('beerPage/indexLogged',{
			beer: beer,
			reviews: reviewWithBeer
			}))
    } catch(e){
        res.status(500).json({ error: e });
    }
})

router.post('/beersList/:id', async (req, res) =>{
	rate = parseInt(req.body.rating);
	const newReview = await reviewData.addReview(
		xss(req.session.user.id),
		xss(req.params.id),
		xss(rate),
		xss(req.body.comment)
	);

	res.render('partials/reviews',{
		layout: null,
		...newReview
	})
});

router.post('/beerSubmission', async (req, res) => {
	let beerPost = req.body;
	let errors = [];
	beerPost.abv = parseInt(beerPost.abv)
	if (!beerPost.name) {
		errors.push('No name provided');
	}

	if (!beerPost.type) {
		errors.push('No type provided');
	}
	if (!beerPost.abv) {
		errors.push('No abv provided');
	}
	if (!beerPost.malt) {
		errors.push('No malt provided');
	}
	if (!beerPost.hops) {
		errors.push('No hops provided');
	}
	if (!beerPost.notes) {
		errors.push('No notes provided');
	}
	if (beerPost.abv < 0 || beerPost.abv > 100) {
		errors.push("abv must be between 0 and 100")
	}

	if (typeof(beerPost.abv) !== "number") {
		errors.push("abv must be a number")
	}

	if (errors.length > 0) {
		res.render('beerSubmission/index', {
			errors: errors,
			hasErrors: true,

		});
		return;
	}

	try {

		beerPost.hops = beerPost.hops.split(",")
		
		beerPost.malt = beerPost.malt.split(",")
		beerPost.abv = parseInt(beerPost.abv)
		const newBeer = await beerData.addBeer(
			xss(beerPost.name),
			xss(beerPost.type),
			xss(beerPost.abv),
            xss(beerPost.malt),
            xss(beerPost.hops),
			xss(beerPost.notes),
			
		);

		res.redirect(`/beers/beersList`);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports=router;