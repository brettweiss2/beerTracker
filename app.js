const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "AuthCookie",
        secret: "some secret string!",
        resave: false,
        saveUninitialized: true
    })
)

app.use(async (req, res, next)=>{
	let msg = undefined
	if (req.session.user)
		msg = "(Authenticated User)";
	else
		msg = "(Non-Authenticated User)";
	console.log(`[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} ${msg}`);
	next();
})

app.engine('handlebars', exphbs({ 
    defaultLayout: 'main' ,
    partialsDir: ['views/partials/']}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
	console.log('beerTracker routes will be running on http://localhost:3000');
});