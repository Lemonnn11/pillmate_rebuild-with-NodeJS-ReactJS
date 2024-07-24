const Drug = require('./../models/drugModel');

exports.getAllDrugs = async (req, res, next) => {
  try {
    let query = Drug.find();

    // search query
    if (req.query.query) {
      query = query.find({ $text: { $search: req.query.query } });
    }

    // filter
    const queryObj = { ...req.query };
    const excludeFields = ['sort', 'page', 'fields', 'limit', 'query'];
    excludeFields.forEach(el => delete queryObj[el]);
    query = query.find(queryObj);

    // pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    // limit fields
    if (req.query.fields) {
      const fieldsList = req.query.fields.split(',').join(' ');
      query = query.select(fieldsList);
    }

    const doc = await query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        doc
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const listOfIndexes = await Drug.distinct('category');
    const filterredList = listOfIndexes.filter(category => category !== null);
    res.status(200).json({
      status: 'success',
      results: filterredList.length,
      data: {
        filterredList
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
