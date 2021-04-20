
const calculateTip=(total,tip)=>total+(total*tip)
const add=(a,b)=>{
    return new Promise((resolve,reject)=>{
resolve(a+b)
if(a<0 || b<0){
reject("Negative numbers found")
}   
    })
}


module.exports={
    calculateTip,
    add
}