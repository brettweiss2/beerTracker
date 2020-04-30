const express = require('express');
const router = express.Router();
const data = require('../data');
const beerData = data.beers;



//to post a beer
router.get('/post', async (req, res) =>{
    const beerList = await beerData.getAllBeers();

    res.render('beers/post',{beers: beerList})
})


// get all beers
router.get('/', async (req, res) =>{
	let query = req.query;
	console.log(query.page)
	console.log(query.size)

		const beerList = await beerData.getAllBeers(1, 4);
		console.log('^^^^', beerList)
    res.render('beersList/index',{beers: beerList})
})


//get specific one with that id
router.get('/:id', async (req, res) =>{
    try{
        const beer = await beerData.getBeer(req.params.id);
        res.render('beers/single', {beer: beer});
    } catch(e){
        res.status(500).json({ error: e });
    }
})


router.post('/', async (req, res) => {
	let beerPost = req.body;
	let errors = [];

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





	if (errors.length > 0) {
		res.render('beers/post', {
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

		res.redirect(`/beers`);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports=router;