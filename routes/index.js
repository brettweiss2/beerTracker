const beerRoutes = require('./beers');
const signUpLoginRoutes = require('./signUpLogin');
const dashboardRoutes = require('./dashboard');
const userRoutes = require('./user')

const constructorMethod = (app) => {
    app.use('/beers', beerRoutes);
    app.use('/signUpLogin', signUpLoginRoutes);
    app.use('/dashboard', dashboardRoutes);
    app.use('/user', userRoutes);

    app.get('/', async(req,res) => {
        if(!req.session.user){
            res.render('home/index');
        }else(res.render('home/indexLogged'));
    });

    app.get('/beersList',(req, res) =>{
        if(!req.session.user){
            res.render('beersList/index');
        }else(res.render('beersList/indexLogged'));
    });

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