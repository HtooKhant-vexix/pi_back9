# Project Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
NODE_ENV=development
```

## Running the Application

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic reloading.

### Production Mode
```bash
npm start
```

## Testing
```bash
npm test
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── routes/         # API routes
├── services/       # Business logic
└── server.js       # Application entry point
```

## Security Considerations

1. Authentication
   - All sensitive endpoints are protected with authentication middleware
   - Token verification required for protected routes

2. Input Validation
   - User input is validated using express-validator
   - Sanitization of email addresses and other inputs

3. Security Headers
   - Helmet.js is used for setting security headers
   - CORS is configured for cross-origin requests

## Mock Services

The project includes mock implementations for hardware interfaces:

1. GPIO
   - Simulates GPIO pin operations
   - Maintains pin states in memory
   - Supports basic read/write operations

2. Serial Communication
   - Simulates serial port /dev/ttyS3
   - Configurable baud rate and communication parameters
   - Implements read/write operations with timeout handling