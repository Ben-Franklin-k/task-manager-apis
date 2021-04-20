const express=require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const router=express.Router()
const multer=require('multer');
const sharp=require('sharp');
const { sendWelcomeEmail, sendCancellationEmail } = require('../email/account');

router.post('/user/login',async(req,res)=>{
try {
    const user=await User.isCredentialMatched(req.body.email,req.body.password)
    const token=await user.generateToken()
    res.send({user,token})
} catch (error) {
    res.status(401).send(error)
}
})


router.post('/user/logout',auth, async(req,res)=>{
try {
    req.user.tokens=req.user.tokens.filter(token=>token.token !== req.token)
   await req.user.save() 
   res.send()
} catch (error) {
    res.status(500).send()
}
})

router.post('/user/logoutAll',auth, async(req,res)=>{
    try {
        req.user.tokens=[]
       await req.user.save() 
       res.send()
    } catch (error) {
        res.status(500).send()
    }
    })


router.post('/user',async(req,res)=>{
    const user=new User(req.body)

try {
  const saved= await user.save()
  const token=await user.generateToken()
   sendWelcomeEmail(saved.email,saved.name)
   res.status(201).send({saved,token})
} catch (error) {
    res.status(400).send(error)
}
})

router.get('/user/me',auth,async(req,res)=>{
res.send(req.user)
})


router.patch('/user/me',auth, async(req,res)=>{
const updates=Object.keys(req.body)
const allowedUpdates=['name','email','password','age']
const isValid=updates.every(update=>allowedUpdates.includes(update))
if(!isValid){
    return res.status(400).send(" Invalid update")
}
    try {

        updates.forEach(update=>req.user[update]=req.body[update])
       await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/user/me',auth,async(req,res)=>{
    try {
        sendCancellationEmail(req.user.email,req.user.name)
await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload=multer({
  limits:5000000,
  fileFilter(req,file,cb){
let originalFileName=file.originalname.toLowerCase()
if(!originalFileName.match(/\.(jpg|png|jpeg)/)){
  return  cb(new Error('I don\'t have a clue!'))
}
cb(null,true)
  }
})

router.post('/me/avatar',auth,upload.single('upload'),async(req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:500,height:500})  .rotate()     .png().toBuffer()
    req.user.avatar=buffer
   await req.user.save()
res.send()
},(error,req,res,next)=>{
res.status(400).send({error:error.message})
})

router.delete('/me/avatar',auth,upload.single('upload'),async(req,res)=>{
    try {
 req.user.avatar=undefined
 await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)

    }
})

router.get('/user/:id/avatar',async(req,res)=>{
    const user=await User.findById(req.params.id)
    if(!user || !user.avatar){
        throw  new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
})
module.exports=router