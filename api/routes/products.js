const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


// menentukan penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
})

const fileFilter = (req, file, cb) => {

    //* extention file yang di izinkan
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
})

const Product = require('../models/Products')

router.get('/', (req, res, next) => {
    Product.find()
    .select('name age _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    age : doc.age,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request : {
                        method : 'GET',
                        url : 'http://localhost:3000/product/' + doc._id
                    }
                }
            })
        }
        res.status(200).json({
            message : 'data was fetched',
            dataProducts :response
        })
    })
    .catch(err=>{
        res.status(500).json({
            error : err
        })
    })  
})

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name age _id productImage')
    .exec()
    .then(doc=> {
        if(doc){
            res.status(200).json({
                message : 'data was fetched',
                dataProduct : {
                    name : doc.name,
                    age: doc.age,
                    productImage: doc.productImage,
                    request : {
                        method: 'GET',
                        url: 'http://localhost:3000/product/'
                    }
                }
            })
        }else{
            res.status(404).json({message : 'Product ID not found'})
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
})

router.post('/',upload.single('productImage'),(req, res) => {
    console.log(req.file)
    const product = new Product({
        name: req.body.name,
        age: req.body.age,
        productImage: req.file.path
    });
        product
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Created product successfully',
                dataProduct: {
                    name : result.name,
                    age : result.age,
                    productImage: result.productImage,
                    request : {
                        methods : 'GET',
                        url : 'http://localhost:3000/product/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error :err
            });
        })
    });

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propsName] = ops.value;
    }

    Product.update({ _id : id}, {$set: updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Data updated',
            product : result   
    })
    .catch(err => console.log(err))
    })
})

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId
    Product.remove({ _id : id})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Data product was deleted',
            result : {
                body : {
                    name : 'String',
                    age : 'Number',
                },
                request : {
                    methods : 'POST',
                    url : 'http://localhost:3000/product/'
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router