const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./config/mongodb').mongoURI
const mongoose = require('mongoose');

const productRouter = require('./api/routes/products');
const orderRouter = require('./api/routes/order');

// connect to database

    mongoose.connect(db,{
        useFindAndModify : false,
        useNewUrlParser :true
    })
    .then(()=> console.log('mongoDB connected'))
    .catch(err=>console.log(err));



app.use(morgan('dev'));
app.use('/Uploads', express.static('Uploads'))
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// routes
app.use('/product', productRouter);
app.use('/order', orderRouter);

// error handling

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404

    next(err)
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500 )
    res.json({
        error : {
            message : err.message
        }
    })
})


module.exports = app