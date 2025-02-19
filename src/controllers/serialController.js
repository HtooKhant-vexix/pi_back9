const SerialService = require('../services/serialService');

const sendData = async (req, res, next) => {
  try {
    const { data } = req.body;
    const result = await SerialService.sendSerialData(data);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const readData = async (req, res, next) => {
  try {
    const data = await SerialService.readSerialData();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendData,
  readData
};