import app from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/userModel';

const api = request(app);

afterAll(() => {
  mongoose.connection.close();
});

const dummyUser = {
  username: 'admin_root.user',
  password: 'Strong_Password1',
  firstName: 'Admin',
  lastName: 'Root',
};

test('endpoints respond with json', async () => {
  await api.get('/api/auth/login/status').expect('Content-Type', /json/);

  await api
    .post('/api/auth/login')
    .send({ username: 'admin', password: '$trongPassword1' })
    .expect('Content-Type', /json/);

  await api.post('/api/users').send(dummyUser).expect('Content-Type', /json/);
});

describe('user', () => {
  describe('user creation', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test('user can be created', async () => {
      await api.post('/api/users').send(dummyUser).expect(201);

      const foundUser = await User.findOne({ username: dummyUser.username });
      expect(foundUser).not.toBeNull();
    });

    test('password is hashed in the database', async () => {
      await api.post('/api/users').send(dummyUser).expect(201);

      const foundUser = await User.findOne({
        passwordHash: dummyUser.password,
      });
      expect(foundUser).toBeNull();
    });

    describe('user is not created if', () => {
      test('username is not valid', async () => {
        await api
          .post('/api/users')
          .send({ ...dummyUser, username: 'space in username' })
          .expect(400);

        await api
          .post('/api/users')
          .send({ ...dummyUser, username: '!@#$%^&*()+' })
          .expect(400);
      });

      test('name is not alpha', async () => {
        await api
          .post('/api/users')
          .send({ ...dummyUser, firstName: '123!@#$%^&*()_+' })
          .expect(400);

        await api
          .post('/api/users')
          .send({ ...dummyUser, lastName: '!@#$%^&*()+' })
          .expect(400);
      });

      test('password is not strong', async () => {
        const password = 'weakpassword';

        await api
          .post('/api/users')
          .send({ ...dummyUser, password })
          .expect(400);

        const foundUser = await User.findOne({ passwordHash: password });
        expect(foundUser).toBeNull();
      });

      test('username is not unique', async () => {
        await api.post('/api/users').send(dummyUser);

        await api
          .post('/api/users')
          .send({
            username: dummyUser.username,
            password: 'Str0ng_Password',
            firstName: 'First',
            lastName: 'Last',
          })
          .expect(400);

        const foundUsers = await User.find({ username: dummyUser.username });
        expect(foundUsers.length).toBe(1);
      });
    });
  });
});

describe('login', () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(dummyUser);
  });

  const dummyCreds = {
    username: dummyUser.username,
    password: dummyUser.password,
  };

  test('user can login', async () => {
    await api.post('/api/auth/login').send(dummyCreds).expect(200);
  });

  describe('login fails if credentials are invalid', () => {
    test('missing username', async () => {
      await api
        .post('/api/auth/login')
        .send({ password: dummyCreds.password })
        .expect(400);
    });

    test('missing password', async () => {
      await api
        .post('/api/auth/login')
        .send({ username: 'newUser' })
        .expect(400);
    });

    test('username does not exist', async () => {
      await api
        .post('/api/auth/login')
        .send({ username: 'nonExistingUser', password: dummyCreds.password })
        .expect(400);
    });

    test('password is incorrect', async () => {
      await api
        .post('/api/auth/login')
        .send({ username: dummyCreds.username, password: 'wrongpassword' })
        .expect(400);
    });
  });
});
