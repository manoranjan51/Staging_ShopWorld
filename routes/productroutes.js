const express = require("express");

const {protect} = require('../middleware/authmiddleware');
const {admin} = require('../middleware/adminmiddleware');
const {getProduct , getProductById , createProduct , updateProduct , deleteProduct} = require('../controller/productcontroller');

const multer = require('multer');
const upload = multer ({dest:'uploads/'});


const router = express.Router();
//all product
router.route('/').get(getProduct).post(protect , admin ,upload.single('image'), createProduct);
// specific product
router.route('/:id').get(getProductById).put(protect , admin , upload.single('image'),updateProduct).delete(protect , admin , deleteProduct);

module.exports = router;