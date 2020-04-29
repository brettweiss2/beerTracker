const beerRoutes = require('./beers');
const userRoutes = require('./users');
const signUpLoginRoutes = require('./signUpLogin')

const constructorMethod = (app) => {
	app.use('/beers', beerRoutes);
    // app.use('/users', userRoutes);

    app.get('/',(req, res) =>{
        res.render('home/index');
    })

    app.get('/signUpLogin',(req, res) =>{
        res.render('signUpLogin/index');
    })

    app.get('/beersList',(req, res) =>{
        res.render('beersList/index');
    })

    app.get('/userProfile',(req, res) =>{
        res.render('userProfile/index');
    })

    app.get('/dashboard',(req, res) =>{
        res.render('dashboard/index');
    })

    app.get('/beerPage',(req, res) =>{
        res.render('beerPage/index', {
            rateNum: '3',
        });
    })

    app.get('/beerSubmission',(req, res) =>{
        res.render('beerSubmission/index');
    })


	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;