const mongoose = require("mongoose");
const taskSchema=new mongoose.Schema({
  description: {
    type: String,
    required:true,
    trim:true,
  },
  isCompleted: {
    type: Boolean,
    default:false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'Users'
  }
},{
  timestamps:true
})
taskSchema.pre('save',async function(next){
  const task=this
next()
})

const Task = mongoose.model("task",taskSchema ); 

  module.exports=Task