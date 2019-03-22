const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const messages = require('express-messages');

//Connecting to database
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mongodb");
});

//Initialising the express app
const app = express();
app.use(express.json());

//Setting up the template engine views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Setting public folder
app.use(express.static(path.join(__dirname, 'public')));

//Set global error variable
app.locals.errors = null;

//Body-parser middleware 
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

// Validator middleware
app.use(expressValidator());

//Express messages middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

//Setting routes
const adminPages = require('./routes/admin_pages.js');
const pages = require('./routes/pages.js');

app.use('/admin/pages', adminPages);
app.use('/', pages)

//Setting up the port 
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Server started on port ${port}`)
});