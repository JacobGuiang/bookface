import app from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/userModel';

const api = request(app);

afterAll(() => {
  mongoose.connection.close();
});

describe('user', () => {
  describe('user creation', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test('user can be created', async () => {
      await api
        .post('/api/users')
        .send({ username: 'newUser', password: '$trongPassword1' })
        .expect(201);

      const foundUser = await User.findOne({ username: 'newUser' });
      expect(foundUser).not.toBeNull();
    });

    test('password is hashed in the database', async () => {
      const password = '$trongPassword1';

      await api
        .post('/api/users')
        .send({ username: 'newUser', password })
        .expect(201);

      const foundUser = await User.findOne({ passwordHash: password });
      expect(foundUser).toBeNull();
    });

    test('user is not created if password is not strong', async () => {
      const password = 'weakpassword';

      await api
        .post('/api/users')
        .send({ username: 'newUser', password })
        .expect(400);

      const foundUser = await User.findOne({ passwordHash: password });
      expect(foundUser).toBeNull();
    });

    test('user is not created if username is not unique', async () => {
      const username = 'uniqueUser';

      await api
        .post('/api/users')
        .send({ username, password: '$trongPassword1' });

      await api
        .post('/api/users')
        .send({ username, password: '$trongPassword2' })
        .expect(400);

      const foundUsers = await User.find({ username });
      expect(foundUsers.length).toBe(1);
    });
  });
});

test('endpoints respond with json', async () => {
  await api.get('/api/login/status').expect('Content-Type', /json/);

  await api
    .post('/api/login')
    .send({ username: 'admin', password: '$trongPassword1' })
    .expect('Content-Type', /json/);

  await api
    .post('/api/users')
    .send({ username: 'newUser', password: '$trongPassword1' })
    .expect('Content-Type', /json/);
});

describe('login', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await api
      .post('/api/users')
      .send({ username: 'admin', password: '$trongPassword1' });
  });

  test('user can login', async () => {
    await api
      .post('/api/login')
      .send({ username: 'admin', password: '$trongPassword1' })
      .expect(200);
  });

  describe('login fails if credentials are invalid', () => {
    test('missing username', async () => {
      await api
        .post('/api/login')
        .send({ password: '$trongPassword1' })
        .expect(400);
    });

    test('missing password', async () => {
      await api.post('/api/login').send({ username: 'newUser' }).expect(400);
    });

    test('username does not exist', async () => {
      await api
        .post('/api/login')
        .send({ username: 'nonExistingUser', password: '$trongPassword1' })
        .expect(400);
    });

    test('password is incorrect', async () => {
      await api
        .post('/api/login')
        .send({ username: 'admin', password: 'wrongpassword' })
        .expect(400);
    });
  });
});
