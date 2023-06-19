const User = require("../Models/User");
const Product = require("../Models/Products");
// const { where } = require("sequelize");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// user ki creation

const create = async (event) => {
  const { name, email, password} = JSON.parse(event.body);

  try {
   
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Await the bcrypt.hash() function to get the hashed password

    const user = await User.create({ name, email, password: hashedPassword });

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({name:user.name, email: user.email}),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error hai tumhara" }),
    };
  }
};



const login = async (event) => {
  const { email, password } = JSON.parse(event.body);

  try {
    const user = await User.findOne({
      where: { email,  }, //deleted: false
    });

    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Incorrect password or email" }),
      };
    }

    // Compare passwords using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Incorrect password or email" }),
      };
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'shhs', { expiresIn: '1h' });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Welcome user ${user.email}`,
        token: token,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server issue" }),
    };
  }
};


// all users ka data
const getAll = async (event) => {

  try {
    const users = await User.findAll();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application.json",
      },
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "server issue" }),
    };
  }
};

//  specific user ka data
const getById = async (event) => {
  const { id } = event.pathParameters;

  const token = event.headers['authorization'];

  try {
    const decodedToken = jwt.verify(token, 'shhs');
    const userId = decodedToken.userId;

    const user = await User.findOne({ where: { id: userId } });
    console.log("uuuseer here", user);
    if (!user ) {
      // console.log("========>", user.token);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid token' }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// update data
const update = async (event) => {
  const { id } = event.pathParameters;
  const { name, email } = JSON.parse(event.body);

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    await user.update({ name, email });

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// delete wala
const deleteUser = async (event) => {
  const { id } = event.pathParameters;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }
    

    await user.destroy()
    return {
      statusCode: 204,
      body: "user deleted",
    };

    
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

module.exports = { getAll, getById, create, update, deleteUser, login };
