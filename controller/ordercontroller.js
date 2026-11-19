const Order = require("../model/Ordermodel");

const sendmail = require("../utils/sendmail");

// Create a new user
const createOrders = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;


    if (!items || items.length === 0 || !totalAmount || !address) {
      return res.status(400).json({
        message: "Invalid order data"
      });
    }

    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentId,
    });

    await order.save();

    const message = `Dear ${req.user.name},\n\nThank you for order!
Your order has been sucessfully created with the following details:
\n\nOrder ID:${order._id}\nTotal Amount:$${totalAmount}\nShiping Adress:
${address}\n\nWe notify you once your order is shipped.\n\nBest regards,\nShopWorld Teams.`;

    await sendmail(
      req.user.email,
      "Order Created",
      message
    );

    res.status(201).json({
      message: "Order Created Sucessfully",
      order,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error creating",
      error,
    });
  }
};

const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.productId",
      "name price",
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status;
      await order.save();
      res.json({ message: "Order status updated ", order });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

module.exports = {
  createOrders,
  myOrders,
  getOrders,
  updateOrderStatus,
};
