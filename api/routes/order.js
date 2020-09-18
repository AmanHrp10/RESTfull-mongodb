const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const orderController = require('../controllers/order');

// get orders
router.get('/', checkAuth, orderController.order_get_all);
// get by Id
router.get('/:orderId', checkAuth, orderController.get_order);
// create order
router.post('/', checkAuth, orderController.create_order);
// request delete
router.delete('/:orderId', checkAuth, orderController.delete_order)

module.exports = router