const request = require('supertest');
const app = require('../src/app');

const { connectDb,userOne,userOneId } = require('./db.test');

beforeEach(connectDb);

test('Add Task',async()=>{
   await request(app).post('/task').set('Authorization',`Bearer ${userOne.tokens[0].token}`).send({
       description:'Testing'
   }).expect(200)
})