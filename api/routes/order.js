const express = require('express');
const router = express.Router();

const Order = require('../models/orders')
const Product = require('../models/Products');

router.get('/', (req, res, next) => {
    Order.find()
    .populate('product', 'name')
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            message: 'Data orders was fetched',
            Count: docs.length,
            Orders: docs.map(doc => {
                return {
                    quantity: doc.quantity,
                    product: doc.product,
                    _id: doc._id,
                    request: {
                        method: 'GET',
                        url: 'http://localhost:3000/order/' + doc._id
                    }
                }
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// get by Id
router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .select('quantity product _id')
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                order: {
                    quantity: result.quantity,
                    product: result.product,
                    _id: result._id,
                    request: {
                        method: 'GET',
                        url: 'http://localhost:3000/order/'
                    }
                }
            })
        }else{
            res.status(404).json({
                message: 'Order ID not found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

router.post('/', (req, res, next) => {
    Product.findById({_id:req.body.productId})
    .then(dataId => {
        if(!dataId) {
            res.status(404).json({
                message: 'ProductId not found'
            })
        }else{
            const order = new Order({
                product: req.body.productId,
                quantity: req.body.quantity
            });
            order.save()
            .then(result => {
                res.status(200).json({
                    message: 'Order was created',
                    Orders: {
                        quantity: result.quantity,
                        product: result.product,
                        request: {
                            method: 'GET',
                            url: 'http://localhost:3000/order/' + result._id
                        }
                    }
                })
            })    
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

// request delete

router.delete('/:orderId', (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        if(result){
            res.status(200).json({
                message: 'Order deleted',
                body: {
                    product: 'ID',
                    quantity: 'Number'
                },
                request: {
                    method: 'POST',
                    url: 'http://localhost:3000/order/'
                }
            })        
        }else{
            res.status(404).json({
                message: 'order ID not found'
            })
        }
    })
    .catch(err => {
        res.status(200).json({
            error: err
        })
    })
})

module.exports = router