const { PassThrough } = require('stream');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const AppError = require('./../utils/appError');

exports.createQRCode = async (req, res, next) => {
  const qrCodeObj = {};
  try {
    Object.keys(req.body).forEach(el => {
      qrCodeObj[el] = req.body[el];
    });
    qrCodeObj.pharID = req.pharmacy.id;
    qrCodeObj.qrCodeID = uuidv4();
    const qrCodeString = JSON.stringify(qrCodeObj);
    const readable = new PassThrough();
    await QRCode.toFileStream(readable, qrCodeString, {
      type: 'png',
      errorCorrectionLevel: 'L',
      width: 250
    });
    readable.pipe(res);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
