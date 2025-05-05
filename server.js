const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path'); //I think, needed only to access dummy database
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
//Might not be neccessary
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const stateCodes = require('./middleware/verifyStates');
const PORT = process.env.PORT || 3500;

// Connect to db
connectDB();

// custom middleware logger
app.use(logger);

//Handle options credentials check - BEFORE CORS!
//and fetch cookies credentials requirement---this comment in in the authentication vid, maybe it is not necessarily correct or applicable here?>
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
// app.use('/register', require('./routes/register')) <-- This is in "User Password Authentication" vid __ Maybe its a post method?--its for URL route www.blah.com/register for registering a new user
app.use('/employees', require('./routes/api/employees')); //gets employees
//FOR THE PROJ
app.use('/states', require('./routes/api/states')); //gets stateData.json??

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
