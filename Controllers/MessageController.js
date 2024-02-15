const expressAsyncHandler=require('express-async-handler')
const Message=require('../Models/Message')
const Chat=require('../Models/Chat')
const User=require('../Models/Users')
const BadRequestError=require('../errors/bad-request')

const getAllMessages = expressAsyncHandler(async (req, res) => {
  try {
    // console.log("Chat ID:", req.params.chatId);
    // const chatId=req.params.chatId;
    // console.log(chatId)
    const messages = await Message.find({chat: req.params.chatId})
      .populate("sender", "username email")
      .populate("reciever")
      .populate("chat");
    console.log("Fetched Messages:", messages);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


const sendMessage=expressAsyncHandler(async(req,res)=>{
    const{chatId,content}=req.body
    if(!content || !chatId){
        console.log("Invalid data passed into request")
        return res.sendStatus(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    }
    try {
        var message = await Message.create(newMessage);
    
        console.log(message);
        message = await message.populate("sender", "name");
        message = await message.populate("chat");
        message = await message.populate("reciever");
        message = await User.populate(message, {
          path: "chat.users",
          select: "username email",
        });
    
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    });
    
    module.exports = { getAllMessages, sendMessage };
