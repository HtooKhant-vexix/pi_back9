const redisService = require('./redisService');

// Mock GPIO implementation for development
class MockGpio {
  constructor(pin, direction) {
    this.pin = pin;
    this.direction = direction;
    this.value = 0;
  }

  async write(value) {
    this.value = value;
    // Cache the GPIO state
    await redisService.cacheGpioState(this.pin, value === 1);
    return value;
  }

  async read() {
    // Get cached state or current value
    const cachedState = await redisService.getGpioState(this.pin);
    return cachedState ? (cachedState.state ? 1 : 0) : this.value;
  }

  unexport() {
    // Cleanup mock resources
  }
}

// Store GPIO pin states in memory
const pinStates = new Map();

const setGpioState = async (pinNumber, state) => {
  try {
    if (!pinStates.has(pinNumber)) {
      pinStates.set(pinNumber, new MockGpio(pinNumber, 'out'));
    }
    const pin = pinStates.get(pinNumber);
    await pin.write(state ? 1 : 0);
    return { pinNumber, state };
  } catch (error) {
    throw new Error(`GPIO Error: ${error.message}`);
  }
};

const getGpioState = async (pinNumber) => {
  try {
    if (!pinStates.has(pinNumber)) {
      pinStates.set(pinNumber, new MockGpio(pinNumber, 'in'));
    }
    const pin = pinStates.get(pinNumber);
    const value = await pin.read();
    return { pinNumber, state: value === 1 };
  } catch (error) {
    throw new Error(`GPIO Error: ${error.message}`);
  }
};

// Cleanup mock GPIO on process exit
process.on('SIGINT', () => {
  for (const pin of pinStates.values()) {
    pin.unexport();
  }
  pinStates.clear();
});

module.exports = {
  setGpioState,
  getGpioState
};