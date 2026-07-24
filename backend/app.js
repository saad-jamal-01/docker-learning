const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Logger = require('./src/utils/loggers.js');

const Users = require('./src/Models/User.js');

Logger.handleUncaughtExceptions();

const app = express();
app.use(cors());
app.use(express.json());
app.use(Logger.httpMiddleware());

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

app.get('/api/user', async (req, res, next) => {
  try {
    const users = await Users.findAll();

    Logger.info('users list fetched');

    return res.json({ users, totalUserCount: users.length });
  } catch (err) {
    next(new Error('Error fetching users list'));
  }
});

app.post('/api/user', async (req, res, next) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || firstName.trim().length === 0) {
      res.status(400);
      const error = new Error('First name is required');

      return next(error);
    }

    if (!lastName || lastName.trim().length === 0) {
      setTimeout(() => {
        throw new Error('Last name missing');
      }, 1000);
    }

    const newUser = await Users.create({
      firstName: firstName.trim(),
      lastName: (lastName || '').trim() ?? generateSecureString(6),
    });

    Logger.info(`new user created with id ${newUser.id}`);

    return res.json({ user: newUser });
  } catch (err) {
    next(new Error('Error creating user'));
  }
});

app.delete('/api/user/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;

    const deletedUser = await Users.destroy({
      where: {
        id: userId,
      },
    });

    if (!!deletedUser) {
      Logger.info(`User with id ${userId} deleted`);
    } else {
      Logger.warn(`User with id ${userId} not found`);
    }

    return res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    next(new Error('Error deleting user'));
  }
});

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  Logger.error(err.message || 'Internal Server Error');

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
