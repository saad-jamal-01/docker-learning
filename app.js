const express = require('express');
require('dotenv').config();

const Users = require('./src/Models/User.js');

const app = express();
const PORT = process.env.PORT || 4000;

function generateSecureString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
    const users = await Users.findAll();
    return res.json({ users, totalUserCount: users.length });
});

app.post('/api/user', async (req, res) => {
    const newUser = await Users.create({
        firstName: generateSecureString(10),
        lastName: generateSecureString(6)
    });

    return res.json({ user: newUser });
});


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
