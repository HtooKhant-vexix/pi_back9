const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || '192.168.1.165',
  port: process.env.REDIS_PORT || 6379,
});

// Cache keys
const SERIAL_DATA_KEY = 'serial:data';
const GPIO_STATE_KEY = 'gpio:state';
const CACHE_EXPIRY = 3600; // 1 hour in seconds

const redisService = {
  // Serial data methods
  async cacheSerialData(data) {
    try {
      await redis.lpush(SERIAL_DATA_KEY, JSON.stringify({
        timestamp: Date.now(),
        ...data
      }));
      await redis.ltrim(SERIAL_DATA_KEY, 0, 99); // Keep last 100 entries
      return true;
    } catch (error) {
      console.error('Redis cache error:', error);
      return false;
    }
  },

  async getSerialHistory(limit = 10) {
    try {
      const data = await redis.lrange(SERIAL_DATA_KEY, 0, limit - 1);
      return data.map(item => JSON.parse(item));
    } catch (error) {
      console.error('Redis get error:', error);
      return [];
    }
  },

  // GPIO state methods
  async cacheGpioState(pinNumber, state) {
    try {
      const key = `${GPIO_STATE_KEY}:${pinNumber}`;
      await redis.set(key, JSON.stringify({
        state,
        timestamp: Date.now()
      }), 'EX', CACHE_EXPIRY);
      return true;
    } catch (error) {
      console.error('Redis GPIO cache error:', error);
      return false;
    }
  },

  async getGpioState(pinNumber) {
    try {
      const key = `${GPIO_STATE_KEY}:${pinNumber}`;
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Redis GPIO get error:', error);
      return null;
    }
  }
};

module.exports = redisService;