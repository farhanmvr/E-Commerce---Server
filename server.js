const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// dotenv
dotenv.config({ path: './.env' });

// app
const app = express();

// database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB CONNECTED`))
  .catch((err) => console.log(`DB CONNECTION ERR ${err}`));

// middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// routes middlewares
fs.readdirSync('./routes').map((r) =>
  app.use('/api', require(`./routes/${r}`))
);

// Handle error for unknown route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);

// Set server PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening to PORT ${PORT}`);
});
