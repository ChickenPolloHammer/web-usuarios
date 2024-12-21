const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const newUser = req.body;
  if (!newUser.email || !newUser.password) {
    return res.status(400).json({ error: 'El correo electrónico y la contraseña son obligatorios.' });
  }
  if (users.some(user => user.email === newUser.email)) {
    return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
  }
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user information
app.put('/api/users/:email', (req, res) => {
  const { email } = req.params;
  const updatedUser = req.body;
  users = users.map(user => (user.email === email ? updatedUser : user));
  res.json(updatedUser);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
