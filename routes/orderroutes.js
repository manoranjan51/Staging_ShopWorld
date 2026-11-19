const express = require('express');

const {protect} = require('../middleware/authmiddleware');
const {admin} = require('../middleware/adminmiddleware');

const {createOrders , getOrders , myOrders , updateOrderStatus } = require('../controller/ordercontroller');

const router = express.Router();

router.route('/').post(protect , createOrders).get(protect , admin , getOrders);
router.route('/myorders').get(protect ,myOrders);
router.route('/:id/status').put(protect , admin , updateOrderStatus);

module.exports = router;
