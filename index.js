const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Import routes
const indexRouter = require('./api/index');
const usersRouter = require('./api/trade');

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
