const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const path = require('path');

const app = express();
const port = process.env.PORT || 5005;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('RecipifiedSecure'));
app.use(session({
  secret: 'RecipifiedSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());


// Middleware to protect routes
// Middleware to protect routes
app.use((req, res, next) => {
  if (!req.session.user && req.url !== '/login' && req.url !== '/layouts/signin' && req.url !== '/layouts/signup') {
    return res.redirect('/login');
  }
  next();
});

 
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views')); 
app.set('layout', 'layouts/main'); 

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);


app.listen(port, ()=> console.log(`Listening to port ${port}`));