import app from '../../../app';
import dbHandler from '../../../model/__tests__/db-handler';
const request = require('supertest');


describe('auth test', () => {
   beforeAll(async () => {
      await dbHandler.connect();
   })
   it('register user', async () => {
      const response = await request(app)
         .post('/api/auth/register')
         .send({ email: 'john@test.com', username: 'username1', password: '123' })
         .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
   })

   it('login', async () => {
      const response = await request(app)
         .post('/api/auth/login')
         .send({ username: 'username1', password: '123' })
         .set('Accept', 'application/json');
      expect(response.status).toEqual(200);
   })

   afterAll(() => {
      dbHandler.closeDatabase();
   })

})