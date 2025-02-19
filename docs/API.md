# REST API Documentation

## Overview
This API provides endpoints for managing users, posts, GPIO pins, and serial communication. All endpoints are protected with authentication middleware.

## Base URL
```
/api
```

## Authentication
All protected endpoints require a valid authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### Get All Users
```http
GET /api/users
```
**Response**: Array of user objects
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "datetime"
  }
]
```

#### Get User by ID
```http
GET /api/users/:id
```
**Response**: Single user object
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "datetime"
}
```

#### Create User
```http
POST /api/users
```
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```
**Validation**:
- Email must be valid
- Name must be at least 2 characters
- Password must be at least 6 characters

#### Update User
```http
PUT /api/users/:id
```
**Authentication Required**
**Body**: Same as create user

#### Delete User
```http
DELETE /api/users/:id
```
**Authentication Required**

### Posts

#### Get All Posts
```http
GET /api/posts
```
**Response**: Array of post objects
```json
[
  {
    "id": "string",
    "title": "string",
    "content": "string",
    "createdAt": "datetime"
  }
]
```

#### Get Post by ID
```http
GET /api/posts/:id
```
**Response**: Single post object

#### Create Post
```http
POST /api/posts
```
**Authentication Required**
**Body**:
```json
{
  "title": "string",
  "content": "string"
}
```

#### Update Post
```http
PUT /api/posts/:id
```
**Authentication Required**
**Body**: Same as create post

#### Delete Post
```http
DELETE /api/posts/:id
```
**Authentication Required**

### GPIO Control

#### Get Pin State
```http
GET /api/gpio/:pinNumber
```
**Authentication Required**
**Response**:
```json
{
  "pinNumber": "number",
  "state": "boolean"
}
```

#### Set Pin State
```http
POST /api/gpio/set
```
**Authentication Required**
**Body**:
```json
{
  "pinNumber": "number",
  "state": "boolean"
}
```

### Serial Communication

#### Read Serial Data
```http
GET /api/serial/read
```
**Authentication Required**
**Response**:
```json
{
  "data": "string"
}
```
**Notes**:
- Timeout after 5 seconds if no data received
- Returns data up to the first newline character

#### Send Serial Data
```http
POST /api/serial/send
```
**Authentication Required**
**Body**:
```json
{
  "data": "string"
}
```
**Response**:
```json
{
  "success": "boolean",
  "message": "string"
}
```

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
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting
No rate limiting is currently implemented.

## Development Mock Services

### GPIO Service
The GPIO service is currently mocked for development:
- Simulates GPIO pin states in memory
- Supports reading and writing pin states
- Cleans up resources on process exit

### Serial Service
The Serial service is currently mocked for development:
- Simulates serial communication on /dev/ttyS3
- Configuration: 9600 baud, 8 data bits, 1 stop bit, no parity
- Simulates receiving data every 5 seconds
- Implements write and read operations with proper error handling