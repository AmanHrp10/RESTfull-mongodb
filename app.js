const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const db = require('./config/mongodb').mongoURI;
const mongoose = require('mongoose');

// import router
const productRouter = require('./api/routes/product');
const orderRouter = require('./api/routes/order');
const userRouter = require('./api/routes/user');

// connect to database
mongoose
  .connect(db, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log(err));

app.use(morgan('dev'));
app.use('/Uploads', express.static('Uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('dotenv').config();

// routes
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/user', userRouter);

// CORS

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Accept, X-Requested-With, Origin, Authorization'
  );

  if (req.method === 'OPTIONS') {
    req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    return res.status(200).json({});
  }
});

// error handling

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;

  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
