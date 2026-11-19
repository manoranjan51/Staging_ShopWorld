const User = require("../model/Usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendmail= require("../utils/sendmail")


    // TODOS : Implement JWT token generation for authentication
const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const message = `
      Welcome to ShopWorld, ${name}.
      Your OTP for registration is: ${otp}
    `;

    // Send email
    await sendmail(
      email,
      "Welcome to ShopWorld - OTP Verification",
      message
    );

    // Send ONLY ONE response
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// Login User 

const loginUser = async (req , res) =>{
    const {email , password} = req.body;
    try {
        const user = await User.findOne({email});
        if(user && (await bcrypt.compare(password, user.password))){
            res.json({
                _id:user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token:generateToken(user._id)
            });
        }else{
            res.status(400).json({message:'Invaild email or password'})   
        }

    } catch (error) {
        res.status(500).json({message:'Server error'})
    }
};

// Get user

const getUsers = async(req , res)=>{
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message:'Server error'})
    };

};

module.exports = {
    registerUser,
    loginUser,
    getUsers
};