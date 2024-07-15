const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Pharmacy = require('./../models/pharmacyModel');
const AppError = require('./../utils/appError');

const createAndSendToken = (pharmacy, statusCode, res) => {
  const token = jwt.sign({ data: pharmacy._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24
    ),
    httpOnly: true
  });

  const result = `${statusCode}`.endsWith('1') ? pharmacy : '';
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      pharmacy: result
    }
  });
};

exports.signup = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.create({
      storeName: req.body.storeName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      serviceDate: req.body.serviceDate,
      serviceTime: req.body.serviceTime,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      province: req.body.province,
      city: req.body.city,
      address: req.body.address,
      password: req.body.password
    });

    pharmacy.password = undefined;

    createAndSendToken(pharmacy, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('Please log in to get access to certain resources', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentPharmacy = await Pharmacy.findById(decoded.data);

  req.pharmacy = currentPharmacy;
  next();
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and Password must be provided', 400));
    }

    const pharmacy = await Pharmacy.findOne({ email }).select('+password');

    if (!pharmacy) {
      if (!(await pharmacy.validatePassword(password, pharmacy.password))) {
        return next(new AppError('Incorrect Email or Password', 401));
      }
    }

    createAndSendToken(pharmacy, 200, res);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
