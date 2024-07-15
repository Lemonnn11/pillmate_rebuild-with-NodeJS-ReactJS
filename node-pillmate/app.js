const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const { rateLimit } = require('express-rate-limit');
const drugRouter = require('./routes/drugRoutes');
const pharmacyRouter = require('./routes/pharmacyRoutes');
const qrCodeRouter = require('./routes/qrCodeRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(helmet());

const limiter = rateLimit({
  max: 60,
  windowMs: 60 * 60 * 1000,
  message: 'Please try again later, you make too many requests'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));

app.use(xss());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/drugs', drugRouter);
app.use('/api/v1/pharmacies', pharmacyRouter);
app.use('/api/v1/qrcodes', qrCodeRouter);

module.exports = app;
