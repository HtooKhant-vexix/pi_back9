const GpioService = require('../services/gpioService');

const setPin = async (req, res, next) => {
  try {
    const { pinNumber, state } = req.body;
    const result = await GpioService.setGpioState(pinNumber, state);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getPin = async (req, res, next) => {
  try {
    const { pinNumber } = req.params;
    const result = await GpioService.getGpioState(parseInt(pinNumber));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  setPin,
  getPin
};