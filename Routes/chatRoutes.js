const express=require('express')
const protect=require('../Middlewares/authMiddleware');
const { accessChat, fetchChats, createChatGroup, fetchGroups, groupExit } = require('../Controllers/chatController');

const router=express.Router();

router.route('/').post(protect,accessChat)
router.route('/').get(protect,fetchChats)
router.route('/createGroup').post(protect,createChatGroup)
router.route('/fetchGroup').get(protect,fetchGroups)
router.route('/exitGroup').put(protect,groupExit)

module.exports=router;