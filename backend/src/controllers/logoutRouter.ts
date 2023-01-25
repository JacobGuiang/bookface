import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  res.clearCookie('token');
  res.send({ loggedOut: true });
});

export default router;
