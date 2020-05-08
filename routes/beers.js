const express = require('express');
const router = express.Router();
const data = require('../data');
const beerData = data.beers;



router.get('/beerSubmission',(req, res) =>{
	if(!req.session.user){
		res.render('beerSubmission/index')
	}else(res.render('beerSubmission/indexLogged'))
})




router.get('/beersList',async(req, res) =>{
	const beerList = await beerData.getAllBeers(1, 4);

	if(!req.session.user){
		res.render('beersList/index',{beers: beerList})
	}else(res.render('beersList/indexLogged',{beers: beerList}))
})

// get all beers



//get specific one with that id
router.get('/:id', async (req, res) =>{
    try{
        const beer = await beerData.getBeer(req.params.id);
        res.render('beers/single', {beer: beer});
    } catch(e){
        res.status(500).json({ error: e });
    }
})


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
			beerPost.notes,
			
		);

		res.redirect(`/beers/beersList`);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports=router;