const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

const corsOptions = {
  origin: 'http://127.0.0.1:8000', // replace with your client app URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// MySQL database connection configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'exc'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Simple route to test the server
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to fetch data from the database
app.get('/trades', (req, res) => {
  // var pr = req?.pair;
  // console.log(req);
  db.query("SELECT * FROM exchange_trades ", (err, results) => {
    if (err) {
      res.status(500).send('Error fetching users');
    } else {
      res.json(results);
    }
  });
});

app.post('/addtrade', (req, res) => {
  // var pr = req?.pair;
  // console.log(req);
  // db.query("SELECT * FROM exchange_trades ", (err, results) => {
  //   if (err) {
  //     res.status(500).send('Error fetching users');
  //   } else {
  //     res.json(results);
  //   }
  // });
  res.json([]);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
