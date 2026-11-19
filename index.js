const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load env variables first
dotenv.config();

const connectDB = require("./config/db.js");
// Connect database
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("ShopWorld backend is working");
});

app.use("/api/auth",require("./routes/authroutes"));
app.use("/api/product",require('./routes/productroutes'));
app.use("/api/orders",require('./routes/orderroutes'));
app.use("/api/payment",require('./routes/paymentroutes'));
app.use("/api/analytics",require('./routes/analyticsroutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});