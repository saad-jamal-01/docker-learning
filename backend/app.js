const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Users = require('./src/Models/User.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

function generateSecureString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomValues = new Uint32Array(length);

  crypto.getRandomValues(randomValues);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomValues[i] % characters.length];
  }

  return result;
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/user', async (req, res) => {
  try {
    const users = await Users.findAll();
    return res.json({ users, totalUserCount: users.length });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching users list' });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name is required');
    }

    const newUser = await Users.create({
      firstName: firstName.trim(),
      lastName: (lastName || '').trim() ?? generateSecureString(6),
    });

    return res.json({ user: newUser });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating user' });
  }
});

app.delete('/api/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    await Users.destroy({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
