const Product = require('../model/Productmodel');
const cloudinary = require('../config/cloudinary');

const getProduct = async (req , res)=>{
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
};

const getProductById = async (req , res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            res.json(product);
        } else{
            res.status(404).json({message:'Product not Found'});
        }
    } catch (error) {
        res.status(500).json({message:'Server error'});
    }
};

const createProduct = async (req ,res)=>{
    try {  
    const { name ,description , price , categeory , stock} = req.body;
    let imageUrl = '';

    if(req.file){
        const result = await cloudinary.uploader.upload(req.file.path);
        imageUrl = result.secure_url;
    }
    const product = new Product ({
        name,
        description,
        price,
        categeory,
        stock,
        imageUrl

    });
    const saveProduct = await product.save();
    res.status(201).json(saveProduct);
    }catch (error) {
       res.status(500).json({message:error.message}) 
    }
};

const updateProduct = async (req , res)=>{
    try {
        console.log(req.body); // add here
        const {name , description , price , categeory , stock} = req.body || {};
        const product = await Product.findById(req.params.id);
        if(product){
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.categeory = categeory || product.categeory;
            product.stock = stock || product.stock;

            if(req.file){
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            };
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        }
        else{
            res.status(404).json({message:"Product not found"})
        }
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const deleteProduct = async (req , res)=>{
    try {
        const product = await Product.findById(req.params.id);
        if(product){
            await product.deleteOne();
            res.json({message:"Product Removed"});
        }else{
            res.status(404).json({message:'Prroduct not found'});
        }
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
};

module.exports = {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};