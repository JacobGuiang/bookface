import app from '../app';
import request from 'supertest';
import mongoose, { Types } from 'mongoose';
import User from '../models/userModel';
import Post from '../models/postModel';
import Comment from '../models/commentModel';

jest.setTimeout(10000);
const api = request(app);

afterAll(() => {
  mongoose.connection.close();
});

const dummyUser = {
  username: 'admin',
  password: 'Strong_Password1',
  name: {
    firstName: 'Admin',
    lastName: 'Root',
  },
};

const dummyUser2 = {
  username: 'fizzbuzz',
  password: 'Strong_Password2',
  name: {
    firstName: 'Fizz',
    lastName: 'Buzz',
  },
};

const dummyUser3 = {
  username: 'leagueplayer',
  password: 'Strong_Password3',
  name: {
    firstName: 'Lee',
    lastName: 'Sin',
  },
};

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
          .send({ ...dummyUser, username: '!@#$%^&*()_+' })
          .expect(400);
      });

      test('name is not alpha', async () => {
        await api
          .post('/api/users')
          .send({
            ...dummyUser,
            name: {
              firstName: '!@#$%^&*()_+',
              lastName: 'Alpha',
            },
          })
          .expect(400);

        await api
          .post('/api/users')
          .send({
            ...dummyUser,
            name: {
              firstName: 'Alpha',
              lastName: '!@#$%^&*()_+',
            },
          })
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

        const username =
          dummyUser.username.charAt(0).toUpperCase() +
          dummyUser.username.slice(1);

        await api
          .post('/api/users')
          .send({
            username,
            password: 'Str0ng_Password',
            name: {
              firstName: 'First',
              lastName: 'Last',
            },
          })
          .expect(400);

        const foundUsers = await User.find({ username: dummyUser.username });
        expect(foundUsers.length).toBe(1);
      });
    });
  });
});

describe('friends', () => {
  let fromId: Types.ObjectId | undefined;
  let toId: Types.ObjectId | undefined;

  beforeEach(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(dummyUser);
    await api.post('/api/users').send(dummyUser2);

    const fromUser = await User.findOne({ username: dummyUser.username });
    fromId = fromUser?._id;
    const toUser = await User.findOne({ username: dummyUser2.username });
    toId = toUser?._id;
  });

  test('friend request can be sent', async () => {
    await api.post('/api/friendRequests').send({ fromId, toId }).expect(201);

    const updatedFromUser = await User.findById(fromId);
    expect(updatedFromUser?.friendRequestsTo).toContainEqual(toId);

    const updatedToUser = await User.findById(toId);
    expect(updatedToUser?.friendRequestsFrom).toContainEqual(fromId);
  });

  test('duplicate friend request is not sent', async () => {
    await api
      .post('/api/friendRequests')
      .send({ fromId: fromId?.toString(), toId: toId?.toString() })
      .expect(201);

    await api
      .post('/api/friendRequests')
      .send({ fromId: fromId?.toString(), toId: toId?.toString() })
      .expect(400);

    await api
      .post('/api/friendRequests')
      .send({ fromId: toId?.toString(), toId: fromId?.toString() })
      .expect(400);
  });

  describe('accept and reject', () => {
    beforeEach(async () => {
      await api
        .post('/api/friendRequests')
        .send({ fromId: fromId?.toString(), toId: toId?.toString() })
        .expect(201);
    });

    test('friend request can be accepted', async () => {
      await api
        .delete('/api/friendRequests')
        .send({
          fromId: fromId?.toString(),
          toId: toId?.toString(),
          accept: true,
        })
        .expect(204);

      const updatedFromUser = await User.findById(fromId);
      expect(updatedFromUser?.friends).toContainEqual(toId);
      expect(updatedFromUser?.friendRequestsTo).not.toContainEqual(toId);

      const updatedToUser = await User.findById(toId);
      expect(updatedToUser?.friends).toContainEqual(fromId);
      expect(updatedToUser?.friendRequestsFrom).not.toContainEqual(fromId);
    });

    test('friend request can be rejected', async () => {
      await api
        .delete('/api/friendRequests')
        .send({
          fromId: fromId?.toString(),
          toId: toId?.toString(),
        })
        .expect(204);

      const updatedFromUser = await User.findById(fromId);
      expect(updatedFromUser?.friendRequestsTo).not.toContainEqual(toId);

      const updatedToUser = await User.findById(toId);
      expect(updatedToUser?.friendRequestsFrom).not.toContainEqual(fromId);
    });

    test('only existing friend requests can be accepted/rejected', async () => {
      await api.post('/api/users').send(dummyUser3).expect(201);
      const user = await User.findOne({ username: dummyUser3.username });
      const userId = user?.id;

      await api
        .delete('/api/friendRequests')
        .send({
          fromId: fromId?.toString(),
          toId: userId,
        })
        .expect(400);
    });

    test('user can unfriend another user', async () => {
      await api
        .delete('/api/friendRequests')
        .send({
          fromId: fromId?.toString(),
          toId: toId,
          accept: true,
        })
        .expect(204);

      await api.delete(`/api/users/${fromId}/friends/${toId}`).expect(204);

      const user = await User.findById(fromId);
      expect(user?.friends).not.toContainEqual(toId);
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

describe('posts', () => {
  let userId: Types.ObjectId | undefined;

  beforeAll(async () => {
    await User.deleteMany({});
    await api.post('/api/users').send(dummyUser);
    const user = await User.findOne({ username: dummyUser.username });
    userId = user?._id;
  });

  describe('create and delete', () => {
    beforeEach(async () => {
      await Post.deleteMany({});
    });

    test('post can be created', async () => {
      await api
        .post('/api/posts')
        .send({
          content: {
            text: 'test post',
          },
          author: userId,
        })
        .expect(201);

      const foundPost = await Post.findOne({ author: userId });
      expect(foundPost).not.toBeNull();

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.posts).toContainEqual(foundPost?._id);
    });

    test('post can be deleted', async () => {
      await api.post('/api/posts').send({
        content: {
          text: 'test post',
        },
        author: userId,
      });

      let foundPost = await Post.findOne({ author: userId });

      await api
        .post('/api/comments')
        .send({ postId: foundPost?.id, content: 'test comment', userId });

      await api.delete(`/api/posts/${foundPost?.id}`).expect(204);

      const updatedUser = await User.findById(userId);
      expect(updatedUser?.posts).not.toContainEqual(foundPost?._id);

      foundPost = await Post.findById(foundPost?.id);
      expect(foundPost).toBeNull();

      const foundComment = await Comment.findOne({ author: userId });
      expect(foundComment).toBeNull();
    });
  });

  describe('like and unlike', () => {
    let postId: string;

    beforeEach(async () => {
      await Post.deleteMany({});
      await api.post('/api/posts').send({
        content: {
          text: 'test post',
        },
        author: userId,
      });
      const post = await Post.findOne({ author: userId });
      postId = post?.id;
    });

    test('post can be liked', async () => {
      await api
        .post(`/api/posts/${postId}/likes`)
        .send({ userId: userId, action: 'like' })
        .expect(200);

      const post = await Post.findById(postId);
      expect(post?.likes).toHaveLength(1);
      expect(post?.likes).toContainEqual(userId);
    });

    test('post can be unliked', async () => {
      await api
        .post(`/api/posts/${postId}/likes`)
        .send({ userId, action: 'like' });
      await api
        .post(`/api/posts/${postId}/likes`)
        .send({ userId, action: 'unlike' })
        .expect(200);

      const post = await Post.findById(postId);
      expect(post?.likes).toHaveLength(0);
      expect(post?.likes).not.toContainEqual(userId);
    });
  });
});

describe('comments', () => {
  let postId: Types.ObjectId | undefined;
  let userId: Types.ObjectId | undefined;

  beforeAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    await api.post('/api/users').send(dummyUser);
    const user = await User.findOne({ username: dummyUser.username });
    userId = user?._id;

    await api.post('/api/posts').send({
      content: {
        text: 'test post',
      },
      author: userId,
    });
    const post = await Post.findOne({ author: userId });
    postId = post?._id;
  });

  beforeEach(async () => {
    await Comment.deleteMany({});
  });

  test('comment can be created', async () => {
    await api
      .post('/api/comments')
      .send({ postId, content: 'test comment', userId });

    const foundComment = await Comment.findOne({ author: userId });
    expect(foundComment).not.toBeNull();

    const post = await Post.findById(postId);
    expect(post?.comments).toContainEqual(foundComment?._id);
  });

  test('comment can be deleted', async () => {
    await api
      .post('/api/comments')
      .send({ postId, content: 'test comment', userId });
    let foundComment = await Comment.findOne({ author: userId });

    await api.delete(`/api/comments/${foundComment?.id}`).expect(204);

    const post = await Post.findById(postId);
    expect(post?.comments).not.toContainEqual(foundComment?._id);

    foundComment = await Comment.findById(foundComment?.id);
    expect(foundComment).toBeNull();
  });
});
