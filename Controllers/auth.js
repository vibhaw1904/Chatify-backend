const StatusCodes=require('http-status-codes')
const User=require('../Models/Users')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const generateToken=require('../config/generateToken')
const expressAsyncHandler=require('express-async-handler')
const{ BadRequestError,UnauthenticatedError,NotFoundError}=require('../errors/Index')

const registerUser=expressAsyncHandler(async(req,res)=>{
    const {username,password,avatar,email}=req.body;
    if(!username || !password || !email){
        throw new BadRequestError("Please Provide All Values");
    }

    const isUserExist=await User.findOne({email})
    if(isUserExist){
        throw new BadRequestError("User with this Email Already Exists");
    }
    const userNameExist = await User.findOne({ username });
    if (userNameExist) {
      throw new BadRequestError("UserName already taken");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword=await bcrypt.hash(password,salt)

    const user=await User.create({
        username,
        password:hashPassword,
        email,
        avatar

    })

   
    res.status(StatusCodes.CREATED).json({
        _id:user._id,
        username:user.username,
        email:user.email,
        avatar:user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });


});

const login=expressAsyncHandler(async(req,res)=>{
    const {username,email,password}=req.body;
    if((!username && !email)||!password){
        throw new BadRequestError("fill all the area");

    }
    const isUser=await User.findOne({
        $or:[{email:email},{username:username}]
    })

    console.log(isUser);
    if(!isUser){
        throw new BadRequestError('Invalid credntials')
    }
 
      res.status(StatusCodes.OK).json({
        _id: isUser._id,
        username: isUser.username,
        email: isUser.email,
        avatar: isUser.avatar,
        isAdmin: isUser.isAdmin,
        token: generateToken(isUser._id),
      });
})
const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
      const users = await User.find(keyword).find({
        _id: { $ne: req.user._id },
      });
      res.send(users);
    });
    

const searchUser = async (req, res) => {
    const { search } = req.query;
  
    const user = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("username avatar _id email bio");
  
    res.status(StatusCodes.OK).json(user);
  };
  module.exports={login,registerUser,searchUser,fetchAllUsersController,}