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
	const recommended = scores.slice(0,7);
	
	const set = new Set(recommended);

	return [...set];
}

router.get('/beerSubmission',(req, res) =>{
	if(!req.session.user){
		res.render('signUpLogin/index')
	}else(res.render('beerSubmission/indexLogged'))
});

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

		if(!req.session.user)
			res.render('beerPage/index',{beer: beer});
		else
			res.render('beerPage/indexLogged',{beer: beer});
    } catch(e){
       res.status(404).json({ error: e });
    }
});

router.post('/beersList/:id/review', async (req, res) =>{
	try {
		if(!req.session.user)
			res.redirect('/beers/beersList/' + req.params.id);
		else {
			const data = req.body;

			if (!data['rating']) {
				res.status(400).json({error: "no rating supplied"});
				return;
			}
			if (!data['review']) {
				res.status(400).json({error: "no review supplied"});
				return;
			}

			await reviewData.addReview(req.session.user.id, req.params.id, Number(data['rating']), data['review']);

			res.redirect('/dashBoard');
		}
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.post('/beersList/:id/comment', async (req, res) =>{
	try {
		if(!req.session.user)
			res.redirect('/beers/beersList/' + req.params.id);
		else {
			const data = req.body;

			if (!data['comment']) {
				res.status(400).json({error: "no comment supplied"});
				return;
			}

			await beerData.addComment(req.params.id, req.session.user.id, data['comment']);

			res.redirect('/beers/beersList/' + req.params.id);
		}
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

// router.post('/beersList/:id', async (req, res) =>{
// 	rate = parseInt(req.body.rating);
// 	const newReview = await reviewData.addReview(
// 		xss(req.session.user.id),
// 		xss(req.params.id),
// 		xss(rate),
// 		xss(req.body.comment)
// 	);

// 	res.render('partials/reviews',{
// 		layout: null,
// 		...newReview
// 	})
// });

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
			beerPost.name,
			beerPost.type,
			beerPost.abv,
            beerPost.malt,
            beerPost.hops,
			beerPost.notes
			
		);

		res.redirect(`/beers/beersList`);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports=router;