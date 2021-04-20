
const app = require('./app')

const port =process.env.PORT

app.listen(port,(err,res)=>{
    if(err){
      return  console.log("Unable to connect to server")
    }
    console.log("Connected to port "+port)
})
