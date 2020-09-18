const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const productController = require('../controllers/product');

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

// ! CRUD request
router.get('/',checkAuth, productController.get_all_product);

router.get('/:productId', checkAuth, productController.get_product);

router.post('/', checkAuth, upload.single('productImage'), productController.product_create);

router.patch('/:productId', checkAuth, productController.product_update);

router.delete('/:productId', checkAuth, productController.product_delete);


module.exports = router