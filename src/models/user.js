const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt =require('jsonwebtoken');
const Task = require("./task");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    default: "dummy@gmail.com",
    required: true,
    trim: true,
    validate: (email) => {
      if (!validator.isEmail(email)) {
        throw new Error("Invalid Email");
      }
    },
  },
  age: {
    type: String,
    default: 0,
    validate(data) {
      if (data < 0) {
        throw new Error("Age should be a positive number");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    required: true,
    validate: (data) => {
      if (data.length < 6) {
        throw new Error("Password should be min 6 char");
      } else if (data === "password") {
        throw new Error("Password cannot be password");
      }
    },
  },
  avatar:{
type:Buffer
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]
},{
  timestamps:true
});
userSchema.virtual('tasks',{
  ref:'task',
  localField:'_id',
  foreignField:"owner"
})
userSchema.methods.toJSON=function () {
  const user=this
 const userObj=user.toObject()
 delete userObj.password
 delete userObj.tokens
 delete userObj.avatar
 return userObj

}
userSchema.methods.generateToken= async function () {
  const user=this
  const token=await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET_KEY)
  user.tokens=user.tokens.concat({token})
 await user.save()
  return token
}

userSchema.statics.isCredentialMatched = async (email, password) => {
  const user = await User.findOne({ email });
  const isMatched = await bcrypt.compare(password, user.password);
  if (!user || !isMatched) {
    throw new Error("Unable to login");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
userSchema.pre("remove",async function (next) {
  const user=this;
  await Task.deleteMany({owner:user._id})
  next()
})
const User = mongoose.model("Users", userSchema);

module.exports = User;
