const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');

//Connecting to database
mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected to Mongodb");
});

//Initialising the express app
const app = express();

//Setting up the port 
const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Server started on port ${port}`)
});

app.get('/', function(req, res) {
        res.render("index", {
            title: 'Home'
        });
    })
    //Setting up the template engine views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');