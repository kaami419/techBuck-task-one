const { Chatroom } = require('../Models/chatroom');


const createChatroom = async (event) => {
  const  name = JSON.parse(event.body);
  const userId = event.queryStringParameters.userId;

  try {
    const chatroom = await Chatroom.create(name, {userId:userId} );
    console.log("user id here =========>", userId);
    //await ChatroomMember.create({ chatroom_id: chatroom.id, user_id: userId, joined_at: new Date() });

    return{
      statusCode: 200,
      header: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({chatroom})
     
  };
  } catch (error) {
    console.log('Create chatroom error:', error);
    return{
      statusCode: 500,
      body: JSON.stringify({message: "Internal Server Error"})
  }
  }
};

const getChatrooms = async (event) => {
  try {
    const chatrooms = await Chatroom.findAll();
    return{
      statusCode: 200,
      header: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({chatrooms})
     
  };
  } catch (error) {
    console.log('Get chatrooms error:', error);
    return{
      statusCode: 500,
      body: JSON.stringify({message: "Internal Server Error", error})
  }
  }
};

const deleteChatroom = async (event) => {
  const chatroomId = event.pathParameters.id;

  try {
    await Chatroom.destroy({ where: { id: chatroomId } });
    return{
      statusCode: 200,
      header: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({message:"chatroom deleted successfully"})
     
  };
  } catch (error) {
    console.log('Delete chatroom error:', error);
    return{
      statusCode: 500,
      body: JSON.stringify({message: "Internal Server Error", error})
  };
  }
};




module.exports = {
  createChatroom,
  getChatrooms,
  deleteChatroom,
};
