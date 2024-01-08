const expressAsyncHandler=require('express-async-handler')
const Chat=require('../Models/Chat')
const User=require('../Models/Users');
const { default: Users } = require('../Models/Users');

const accessChat=expressAsyncHandler(async(req,res)=>{
    const {userId}=req.body;
    if(!userId){
        console.log("userId param not sent with request");
        return res.sendStatus(400);
    }
    var isChat=await  Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},
        ],
    })
    .populate("users","-password")
    .populate("latestMessage");

    isChat=await Users.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email"
    });
    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId],
        };
        try{
            const createdChat=await Chat.create(chatData);
            const FullChat=await Chat.findOne({_id:createdChat._id}).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats=expressAsyncHandler(async(req,res)=>{
    try{
        console.log("Fetch Chats api: ",req);
        Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt: -1})
        .then(async (results) => {
            results = await User.populate(results, {
              path: "latestMessage.sender",
              select: "name email",
            });
            res.status(200).send(results);
          });
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    });
    const fetchGroups=expressAsyncHandler(async(req,res)=>{
        try {
            const allGroups=await Chat.where("isGroupChat").equals(true)
            res.status(200).send(allGroups)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    })
    const  createChatGroup=expressAsyncHandler(async(req,res)=>{
        if(!req.body.users || !req.body.name){
            return res.status(400).send({message:"data is insufficient"})
        }
        var users=JSON.parse(req.body.users)
        console.log("chatControl/createGroups",req)
        users.push(req.user);

        try{
            const groupChat=await Chat.create({
                chatName:req.body.name,
                users:users,
                isGroupChat:true,
                groupAdmin:req.user,
            })
            const fullGroupChat=await Chat.findOne({_id:groupChat._id})
            .populate("users","-password")
            .populate("groupAdmin","-password");
            res.status(200).json(fullGroupChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    })

    const groupExit=expressAsyncHandler(async(req,res)=>{
        const{chatId,userId}=req.body;
        const removed=await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull:{users:userId}
            },
            {
                new:true,
            }
        )
        .populate("users","-password")
        .populate("groupAdmin","-password");
        if(!removed){
            res.status(400)
            throw new Error("Chat not found")
        }
        else{
            res.json(removed)
        }
    })
    module.exports={groupExit,createChatGroup,fetchChats,fetchGroups,accessChat}