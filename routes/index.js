const beerRoutes = require('./beers');
const userRoutes = require('./users');

const constructorMethod = (app) => {
	app.use('/beers', beerRoutes);
    // app.use('/users', userRoutes);

    app.get('/',(req, res) =>{
        res.render('home/index');
    })


	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;