const jwt=require('jsonwebtoken')
const mongoose = require('mongoose');
const User = require('../src/models/user');


const userOneId=new mongoose.Types.ObjectId
const userOne={
  _id:userOneId,
  "name":"mongodb",
  "email":"testlogin@gmail.com",
  "age":10,
  "password":"password123",
  tokens:[{
    token:jwt.sign({_id:userOneId},process.env.JWT_SECRET_KEY)
  }]
}

const connectDb=async()=>{
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports={
    userOne,
    userOneId,
    connectDb
}