const Product = require("../Models/Products");
const User = require("../Models/User");
const jwt = require("jsonwebtoken")

const getProducts = async (event, context) => {
  // Check if the user is authenticated 
  const token = event.headers['authorization'];

  try {
    const decodedToken = jwt.verify(token, 'shhs');
    const userId = decodedToken.userId;
    const user = await User.findOne({ where: { id: userId } });
    if (!user ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    const products = await Product.findAll();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

const getProductById = async (event) => {
  const { id } = event.pathParameters;
  const token = event.headers['authorization'];

  try {
    const decodedToken = jwt.verify(token, 'shhs');
    console.log("==>>>", decodedToken);
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });
    console.log("uuuseer here", user);
    if (!user ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};



const createProduct = async (event) => {
  const { name, description, count, price } = JSON.parse(event.body);
  const token = event.headers['authorization'];

  try {
    const decodedToken = jwt.verify(token, 'shhs');
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });
    console.log("uuuseer here", user);
    if (!user ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }


    const product = await Product.create({ name, description, count, price  });

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(product),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error hai tumhara" }),
    };
  }
};


const deleteProduct = async (event) => {
  const { id } = event.pathParameters;
  const token = event.headers['authorization'];


  try {
    const decodedToken = jwt.verify(token, 'shhs');
    console.log("==>>>", decodedToken);
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });
    console.log("uuuseer here", user);
    if (!user ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    await product.destroy();

    return {
      statusCode: 204,
      body: "Product deleted",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

const updateProduct = async (event) => {
  const { id } = event.pathParameters;
  const { name, description, count, price } = JSON.parse(event.body);
  const token = event.headers['authorization'];


  try {
    const decodedToken = jwt.verify(token, 'shhs');
    console.log("==>>>", decodedToken);
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });
    console.log("uuuseer here", user);
    if (token === null ) {
      return{
        statusCode: 401,
        body: JSON.stringify({message: "No token provided"})
      }
    }
    if (!user ) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    await product.update({name, description, count, price });

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};


const a = Product.count 
console.log(a);

module.exports = { getProducts, createProduct, getProductById, deleteProduct, updateProduct} 
