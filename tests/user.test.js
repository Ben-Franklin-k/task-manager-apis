const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { connectDb,userOne,userOneId } = require('./db');

beforeEach(connectDb);

test('Testing for create User',async()=>{
 const response= await  request(app)
    .post('/user').send(
      {
          "name":"mongodb",
          "email":"benfranklin619@gmail.com",
          "age":10,
          "password":"password123"
    })
    .expect('Content-Type', /json/)
    .expect(201);

const user=await User.findById(response.body.saved._id)
expect(user).not.toBe(null)
expect(response.body.saved).toMatchObject({
      "name":"mongodb",
  "email":"benfranklin619@gmail.com"
})

})

test('Is Login working',async()=>{
  await request(app).post('/user/login').send({
    email:userOne.email,
    password:userOne.password
  }).expect(200)
})

test("Login should fail",async()=>{
  await request(app).post('/user/login').send({
    email:"random@gmail.com",
    password:"unknown"
  }).expect(401)
})

test('Read Me ',async()=>{
  await request(app).get('/user/me').set('Authorization',`Bearer ${userOne.tokens[0].token}`).send().expect(200)
})

test('Delete Me',async()=>{
 const response= await request(app).delete('/user/me').set('Authorization',`Bearer ${userOne.tokens[0].token}`).send().expect(200)
const user= await User.findById(response.body._id)
expect(user).toBe(null)
})

test('Upload avatar',async()=>{
 await request(app).post('/me/avatar').set('Authorization',`Bearer ${userOne.tokens[0].token}`).attach('upload','tests/__mocks__/fixtures/dp.JPG').expect(200)
})

test('Update USer',async()=>{
  await request(app).patch('/user/me').set('Authorization',`Bearer ${userOne.tokens[0].token}`).send({name:"Testing"}).expect(200)
})