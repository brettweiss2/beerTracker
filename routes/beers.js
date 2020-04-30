const express = require('express');
const router = express.Router();
const data = require('../data');
const beerData = data.beers;



//to post a beer
router.get('/post', async (req, res) =>{
    const beerList = await beerData.getAllBeers();
    res.render('beersList/index',{beers: beerList})
})

//to post a beers
// router.all('/', async (req, res) =>{
// 	console.log('&*&*&*', req.body)
//     const beerList = await beerData.getAllBeers(1, 4);
	
//     res.render('beersList/index',{beers: beerList})
// })


// get all beers
router.all('/', async (req, res) =>{
	let query = req.body;
	let page = query.page || 1;
	let size = query.size || 4;
	let beerLike = query.beerLike || '';
	const data = await beerData.getAllBeers(beerLike, page, size);
	const totalCount = data[0].totalCount[0].totalCount;
	let beerList = data[0].result;
	// 分页逻辑需要完善
		beerList.forEach(item => {
			let size = item.reviews_doc.length;
			let rateNum = 0;
			let rating = 0;
			item.reviews_doc.forEach(reviews => {
				rateNum += reviews.rating;
			})
			rating = (rateNum / size).toFixed(1);
			item.rating = (rating % 1 == 0) ? parseInt(rating) : rating;
		})
    res.render('beersList/index',{
			beers: beerList, 
			page: page,
			beerLike: beerLike,
			total: totalCount,
			size: size,
		})
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


router.post('/add', async (req, res) => {
	let beerPost = req.body;
	let errors = [];

	console.log('**********', beerPost)
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
		res.render('beerSubmission/index', {
			errors: errors,
			hasErrors: true,

		});
		return;
	}

	try {
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