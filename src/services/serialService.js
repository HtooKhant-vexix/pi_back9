const { SerialPort } = require("serialport");
const redisService = require("./redisService");

// Create UART port instance using functional approach
const createUARTPort = (config) => {
  const pins = {
    txd: 14, // TXD
    rxd: 15, // RXD
  };

  let port;

  const initialize = () => {
    console.log(
      `Initializing UART on GPIO ${pins.txd} (TXD) and ${pins.rxd} (RXD) at ${config.baudRate} baud`
    );

    // Try different serial port paths
    const possiblePaths = ["/dev/serial0", "/dev/ttyS0", "/dev/ttyAMA0"];
    let serialPath = null;

    for (const path of possiblePaths) {
      try {
        require("fs").accessSync(path);
        serialPath = path;
        break;
      } catch (err) {
        continue;
      }
    }

    if (!serialPath) {
      throw new Error("No valid serial port found");
    }

    try {
      port = new SerialPort({
        path: serialPath,
        baudRate: config.baudRate,
        dataBits: config.dataBits,
        stopBits: config.stopBits,
        parity: config.parity,
      });

      console.log(`Successfully opened serial port: ${serialPath}`);

      port.on("error", (err) => {
        console.error("Serial port error:", err.message);
      });

      port.on("data", (data) => {
        const receivedData = data.toString().trim();
        console.log(`Received data: ${receivedData}`);
        if (receivedData) {
          redisService.cacheSerialData({
            type: "rx",
            pin: pins.rxd,
            data: receivedData,
            baudRate: config.baudRate,
            timestamp: Date.now(),
          });
        }
      });
    } catch (error) {
      console.error("Failed to initialize serial port:", error.message);
      throw error;
    }
  };

  const write = async (data) => {
    return new Promise((resolve, reject) => {
      if (!port || !port.isOpen) {
        reject(new Error("Serial port is not open"));
        return;
      }

      port.write(data, (err) => {
        if (err) {
          reject(err);
          return;
        }

        redisService.cacheSerialData({
          type: "tx",
          pin: pins.txd,
          data: data,
          baudRate: config.baudRate,
          timestamp: Date.now(),
        });

        resolve();
      });
    });
  };

  const read = () => {
    return new Promise((resolve, reject) => {
      if (!port || !port.isOpen) {
        reject(new Error("Serial port is not open"));
        return;
      }

      let data = "";
      let timeout;

      const onData = (chunk) => {
        data += chunk.toString();

        clearTimeout(timeout);
        timeout = setTimeout(() => {
          cleanup();
          resolve(data.trim());
        }, 100); // Wait 100ms for more data
      };

      const onError = (error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        clearTimeout(timeout);
        port.removeListener("data", onData);
        port.removeListener("error", onError);
      };

      port.on("data", onData);
      port.on("error", onError);

      timeout = setTimeout(() => {
        cleanup();
        reject(new Error("Serial read timeout"));
      }, 5000);
    });
  };

  const close = () => {
    if (port && port.isOpen) {
      port.close();
    }
  };

  // Initialize port on creation
  initialize();

  // Return public interface
  return {
    write,
    read,
    close,
    config,
    pins,
  };
};

// Create singleton instance
const port = createUARTPort({
  baudRate: 9600,
  dataBits: 8,
  stopBits: 1,
  parity: "none",
});

// Public API
const sendSerialData = async (data) => {
  try {
    await port.write(data);
    return {
      success: true,
      message: `Data sent successfully via GPIO ${port.pins.txd} (TXD) at ${port.config.baudRate} baud`,
    };
  } catch (error) {
    throw new Error(`Failed to send serial data: ${error.message}`);
  }
};

const readSerialData = async () => {
  try {
    const data = await port.read();
    return {
      currentData: data,
      pin: port.pins.rxd,
      baudRate: port.config.baudRate,
    };
  } catch (error) {
    throw new Error(`Failed to read serial data: ${error.message}`);
  }
};

// Cleanup on process exit
process.on("SIGINT", () => {
  port.close();
});

module.exports = {
  sendSerialData,
  readSerialData,
};
