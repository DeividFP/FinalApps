//Importaciones necesarias para el funcionamiento inicial de la app
const bodyParser = require("body-parser");
const express = require('express');
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

//Routes
const routes = require('./routes/routes');

//BD
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Rest-Api-Example', {
    useMongoClient: true
}).then(db => console.log('db is connected'))
    .catch(err => console.log(err));


//Settings
app.set('port', process.env.PORT || 3000);

//Midelware's
app.use(morgan('dev'));
app.use(bodyParser.json());

//routes
app.use('/routes', routes);


//Start Server
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});