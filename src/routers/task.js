const Task = require("../models/task")
const express=require('express')
const auth = require("../middleware/auth")
const router=express.Router()

router.post('/task',auth, async(req,res)=>{
    const task=new Task({...req.body,owner:req.user._id})
try {
 const saved= await task.save()
 res.status(200).send(saved)
} catch (e) {
    res.status(400).send(e)
}

})
//sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
let match={}
let sort={}
if(req.query.completed){
    match.isCompleted=req.query.completed==='true'
}
if(req.query.sortBy){
const obj=req.query.sortBy.split(':')
sort[obj[0]]=obj[1]==='desc'?-1:1
}
console.log(sort)
try {
  const found=  await Task.find({owner:req.user._id,...match},null,{skip:parseInt(req.query.skip),limit:parseInt(req.query.limit),sort})
  res.send(found)

} catch (error) {
    res.status(500).send(error)

}
})

router.get('/task/:id',auth,async(req,res)=>{
try {
 const found= await Task.findOne({_id:req.params.id,owner:req.user._id})

 if(!found){
    return res.status(404).send("Task not found")
}
res.send(found)
} catch (error) {
    res.status(500).send(error)

}

})


router.patch('/task/:id', async(req,res)=>{
    const updates=Object.keys(req.body)
    try {
        const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send("Task not updated")
        }
        updates.forEach(update=>task[update]=req.body[update])
      await task.save()
      
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.delete('/task/:id',auth,async(req,res)=>{
    try {
        const deleted=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!deleted){
            return res.status(404).send("Task not found")
        }
        res.send("Deleted")
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports=router