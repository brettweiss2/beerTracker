const beerRoutes = require('./beers');
const signUpLoginRoutes = require('./signUpLogin');
const dashboardRoutes = require('./dashboard');

const constructorMethod = (app) => {
	app.use('/beers', beerRoutes);

    app.get('/', async(req,res) => {
        if(!req.session.user){
            res.render('home/index');
        }else(res.render('home/indexLogged'));
    });

    app.get('/userProfile',(req, res) =>{
        if(!req.session.user){
            res.render('userProfile/index');
        }else(res.render('userProfile/indexLogged'));
    });

    app.use('/dashboard', dashboardRoutes);

    app.get('/beersList',(req, res) =>{
        if(!req.session.user){
            res.render('beersList/index');
        }else(res.render('beersList/indexLogged'));
    });

    app.use('/signUpLogin', signUpLoginRoutes);

    app.get('/beerPage',(req, res) =>{
        res.render('beerPage/index', {
            rateNum: '3',
        });
    })

	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;