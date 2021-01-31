const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

// dotenv
dotenv.config({ path: './.env' });

// app
const app = express();

// database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB CONNECTED`))
  .catch((err) => console.log(`DB CONNECTION ERR ${err}`));

// middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cors());

// route
app.get('/api', (req, res) => {
  res.json({
    data: 'done',
  });
});

// Set server PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});
