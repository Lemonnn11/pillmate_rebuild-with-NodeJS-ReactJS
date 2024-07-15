const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'id is required'],
    unique: true
  },
  tradeName: {
    type: String,
    required: [true, 'tradeName is required'],
    unique: true
  },
  genericName: {
    type: String,
    required: [true, 'genericName is required']
  },
  dosageForm: {
    type: String,
    required: [true, 'dosageForm is required'],
    enum: {
      values: ['Capsule', 'Tablet'],
      message: 'dosageForm can be either: Capsule, Tablet'
    }
  },
  protectedFromLight: {
    type: Boolean,
    required: [true, 'protectedFromLight is required']
  },
  imgSource: {
    type: String,
    required: [true, 'imgSource is required']
  }
});

drugSchema.index({ tradeName: 'text', genericName: 'text' });
drugSchema.index({ category: 1 });

const Drug = mongoose.model('Drug', drugSchema);

module.exports = Drug;
