const beerRoutes = require('./beers');
const userRoutes = require('./users');
const signUpLoginRoutes = require('./signUpLogin')

const constructorMethod = (app) => {
	app.use('/beers', beerRoutes);

    app.get('/', async(req,res) => {
        if(!req.session.user){
            res.render('home/index')
        }else(res.render('home/indexLogged'))
    });

    app.get('/userProfile',(req, res) =>{
        if(!req.session.user){
            res.render('userProfile/index')
        }else(res.render('userProfile/indexLogged'))
    });

    app.get('/dashboard',(req, res) =>{
        if(!req.session.user){
            res.render('home/index')
        }else(res.render('dashboard/index'))
    });

    app.get('/beersList',(req, res) =>{
        if(!req.session.user){
            res.render('beersList/index')
        }else(res.render('beersList/indexLogged'))
    });

    app.use('/signUpLogin',signUpLoginRoutes);


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