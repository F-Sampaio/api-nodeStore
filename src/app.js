const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const CONFIG = require('./config');

const app = express();
const router = express.Router();
// banco
mongoose.connect(CONFIG.connectionString)
// Models
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');
// rotas
const indexRoute =  require('./routes/index-route');
const productRoute = require('./routes/products-route');
const customerRoute = require('./routes/customer-route');
const orderRoute = require('./routes/order-route');


app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({extended: false }));

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
})

app.use('/', indexRoute);
app.use('/products', productRoute);
app.use('/customers', customerRoute);
app.use('/orders', orderRoute);


module.exports = app;