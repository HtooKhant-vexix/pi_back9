# Raspberry Pi UART Communication API

## Overview
This API provides a RESTful interface for UART communication using GPIO pins 14 (TXD) and 15 (RXD) on a Raspberry Pi 4B. It supports serial data transmission and reception with configurable parameters.

## Prerequisites
- Raspberry Pi 4B
- Node.js (v18 or higher)
- npm (v8 or higher)
- Enabled UART on Raspberry Pi

## Hardware Setup
1. Enable UART on Raspberry Pi:
   ```bash
   # Edit /boot/config.txt
   sudo nano /boot/config.txt

   # Add or uncomment these lines
   enable_uart=1
   dtoverlay=uart0
   ```

2. Disable serial console:
   ```bash
   sudo systemctl stop serial-getty@ttyAMA0.service
   sudo systemctl disable serial-getty@ttyAMA0.service
   ```

3. Wire connections:
   - GPIO 14 (TXD) -> RX of target device
   - GPIO 15 (RXD) -> TX of target device
   - GND -> GND of target device

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=3000
   NODE_ENV=development
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Start the server:
   ```bash
   npm run dev   # Development mode
   npm start     # Production mode
   ```

## API Endpoints

### Serial Communication

#### Send Data
```http
POST /api/serial/send
```

**Request Body:**
```json
{
  "data": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Data sent successfully via GPIO 14 (TXD) at 9600 baud"
}
```

#### Read Data
```http
GET /api/serial/read
```

**Response:**
```json
{
  "currentData": "string",
  "pin": 15,
  "baudRate": 9600
}
```

### WebSocket Events

The API also provides real-time updates via WebSocket:

- `serialUpdate`: Emitted when new serial data is received
- `gpioStates`: Emitted when GPIO states change

## Serial Configuration

The UART is configured with the following parameters:
- Port: `/dev/ttyAMA0`
- Baud Rate: 9600
- Data Bits: 8
- Stop Bits: 1
- Parity: None

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "status": "number",
  "message": "string",
  "stack": "string (development only)"
}
```

Common HTTP Status Codes:
- 200: Success
- 400: Bad Request
- 500: Internal Server Error

## Development

### Project Structure
```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/         # API routes
├── services/       # Business logic
└── server.js       # Application entry point
```

### Key Files
- `src/services/serialService.js`: UART communication implementation
- `src/routes/serialRoutes.js`: Serial communication endpoints
- `src/services/redisService.js`: Data caching service

### Testing
```bash
npm test
```

## Security
- All endpoints are protected with authentication middleware
- CORS is configured for cross-origin requests
- Helmet.js is used for security headers

## Troubleshooting

1. Permission Issues:
   ```bash
   # Add user to dialout group
   sudo usermod -a -G dialout $USER
   ```

2. Port Access:
   ```bash
   # Check port permissions
   ls -l /dev/ttyAMA0
   
   # Set permissions if needed
   sudo chmod 666 /dev/ttyAMA0
   ```

3. UART Verification:
   ```bash
   # Check if UART is enabled
   ls -l /dev/ttyAMA0
   dmesg | grep ttyAMA0
   ```

## License
MIT License