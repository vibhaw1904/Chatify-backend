const mongoose =require('mongoose')

const chatSchema= new mongoose.Schema({
    chatName:{
        type:String,
        trim:true,
    },
    isGroupChat:{
        type:Boolean,
        default:false,
    },
    users:[{
        type:mongoose.Types.ObjectId,
        ref:"User",
    },],
    latestMesage:{
        type:mongoose.Types.ObjectId,
        ref:"Message",
    },
    groupAdmin:{
        type:mongoose.Types.ObjectId,
        ref:"USer",
    },
},
{timestamps:true}
);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;