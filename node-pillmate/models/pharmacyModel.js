const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const pharmacySchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: [true, 'storeName is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    default: 'image.jpg'
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber is required']
  },
  serviceDate: {
    type: String,
    required: [true, 'serviceDate is required']
  },
  serviceTime: {
    type: String,
    required: [true, 'serviceTime is required']
  },
  latitude: {
    type: String,
    required: [true, 'latitude is required']
  },
  longitude: {
    type: String,
    required: [true, 'longitude is required']
  },
  province: {
    type: String,
    required: [true, 'province is required']
  },
  city: {
    type: String,
    required: [true, 'city is required']
  },
  address: {
    type: String,
    required: [true, 'address is required']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    select: false,
    minlength: [8, 'password must have greater than or equal to 10 characters']
  }
});

pharmacySchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

pharmacySchema.methods.validatePassword = async function(
  givenPassword,
  currentPassword
) {
  return await bcrypt.compare(givenPassword, currentPassword);
};

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

module.exports = Pharmacy;
