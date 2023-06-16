const Product = require("../Models/Products");
// const User = require('../Models/User');
const Order = require("../Models/Orders");
const User = require('../Models/User');
const jwt = require("jsonwebtoken")
// const { log } = require("async");

const saveOrderDetails = async (event, context) => {
  const token = event.headers['authorization'];
  const { productId, orderDetails } = JSON.parse(event.body);


  try {

    const decodedToken = jwt.verify(token, 'shhs');

    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });

    if (!user) {

      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' }),
      };
    }

    product.count -= 1;
    await product.save();

    const order = await Order.create({
      userId,
      productId,
      orderDetails,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Order details saved successfully',
        order,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized' }),
    };
  }
};

const getUserOrders = async (event, context) => {
  // const userId = event.headers["userid"];
  const { userId } = event.queryStringParameters;
  const token = event.headers['authorization'];
  try {
    const decodedToken = jwt.verify(token, 'shhs');
    const userAuth = decodedToken.userId;
    const user = await User.findOne({ where: { id: userAuth } });

    if (!user) {

      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    const orders = await Order.findAll({
      where: {
        userId,
        // deleted: false,
      },
      attributes: ["id", "product_Id"],
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ orders }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve user orders" }),
    };
  }
};


const updateOrder = async (event) => {
  const { id } = event.pathParameters;
  // const { userId } = event.queryStringParameters;
  const { orderDetails, productId } = JSON.parse(event.body);
  const token = event.headers['authorization'];

  try {
    const decodedToken = jwt.verify(token, 'shhs');
    const userAuth = decodedToken.userId;
    const findUser = await User.findOne({ where: { id: userAuth } });
    if (!findUser) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }
    const order = await Order.findOne({ where: { id } });
    if (!order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Order not found" }),
      };
    }
    await Order.update(
      { orderDetails, productId },
      { where: { id: id } }
    );
    const updatedOrder = await Order.findOne({ where: { id }, attributes: ['productId', 'userId', 'id', 'orderDetails'] });

    return {
      statusCode: 200,
      body: JSON.stringify(updatedOrder.dataValues),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};


const deleteOrder = async (event) => {
  const { id } = event.pathParameters;
  const { userId } = event.queryStringParameters;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "You are not the creator of this order" }),
      };
    }
    const order = await Order.findByPk(id);
    if (!order) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "no such order found" })
      }
    }

    await order.destroy();

    return {
      statusCode: 204,
      body: "order deleted",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};




module.exports = { getUserOrders, saveOrderDetails, updateOrder, deleteOrder };
