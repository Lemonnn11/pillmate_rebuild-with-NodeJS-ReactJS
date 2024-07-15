const Pharmacy = require('./../models/pharmacyModel');
const AppError = require('./../utils/appError');

exports.getPharmacy = async (req, res, next) => {
  try {
    const doc = await Pharmacy.findById(req.pharmacy.id);

    if (!doc) {
      return next(new AppError('Document with that ID cannot be found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updatePharmacy = async (req, res, next) => {
  try {
    if (req.body.password) {
      return next(new AppError('This route is not for updating password', 400));
    }

    const filteredBody = {};
    Object.keys(req.body).forEach(el => {
      if (el !== 'password') filteredBody[el] = req.body[el];
    });

    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      req.pharmacy.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        updatedPharmacy
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
