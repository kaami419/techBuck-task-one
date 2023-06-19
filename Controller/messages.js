const { Message } = require('../Models/message');

const getMessages = async (event) => {
    const chatroomId = event.queryStringParameters.chatroomId;
  
    try {
      const messages = await Message.findAll({ where: { chatroom_id: chatroomId } });
      return{
        statusCode: 200,
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({messages})
       
    }
    } catch (error) {
      console.log('Get messages error:', error);
      return{
        statusCode: 500,
        body: JSON.stringify({message: "Internal Server Error"})
    }    }
  };
  
  
  const createMessage = async (event) => {
    const { message_info} = JSON.parse(event.body);
    const  chatroom_id =  event.queryStringParameters.chatroom_id
    console.log(chatroom_id);
    const sender_id = event.queryStringParameters.sender_id
  
    try {
      const message = await Message.create({ message_info, sender_id:sender_id, chatroom_id:chatroom_id, created_at: new Date() });
      return{
        statusCode: 200,
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({message})
       
    };
    } catch (error) {
      console.log('Create message error:', error);
      return{
        statusCode: 500,
        body: JSON.stringify({message: "Internal Server Error"})
    };
    }
  };

  module.exports = {createMessage, getMessages}