const { calculateTip, add } = require("../src/math")

test('Calculate the tip',()=>{
   const total= calculateTip(10,0.2)
   expect(total).toBe(12)
})

test("test with promise",async()=>{
 const sum=await  add(1,3)
 expect(sum).toBe(4)
})