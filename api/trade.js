const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exc'
  });

// Create a user
router.post('/', (req, res) => {
    const user = req.body;
   // users.push(user);
    res.status(201).send(user);
  });
  
  // Read all users
  router.get('/', (req, res) => {


    db.query('SELECT * FROM exchange_trades', (err, results) => {
        if (err) {
          res.status(500).send('Error fetching users');
        } else {
          res.json(results);
        }
      });
   // res.send(users);
  });