import app from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import User from './userModel';

const api = request(app);

afterAll(() => {
  mongoose.connection.close();
});

describe('user creation', () => {
  beforeEach(() => {
    User.deleteMany({});
  });

  test('user can be created', async () => {
    const username = 'newUser';
    const password = 'newPassword';
    const credentials = { username, password };

    await api
      .post('/api/users')
      .send(credentials)
      .expect(201)
      .expect('Content-Type', /json/);

    const foundUser = await User.exists({ username });

    expect(foundUser).not.toBeNull();
  });
});
