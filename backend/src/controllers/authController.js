const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key';

const users = [
  { username: 'student1', password: 'password1' },
  { username: 'student2', password: 'password2' },
];

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
