# Ride Evee Backend API Documentation

A Node.js/Express backend application with JWT authentication, OTP verification, and user management.

## Table of Contents
- [Setup](#setup)
- [Authentication Routes](#authentication-routes)
- [User Management Routes](#user-management-routes)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm run dev
   ```

## Authentication Routes

### POST /auth/signup
Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepassword123"
}
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /auth/otp/send
Request an OTP for email verification.

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Response:** (200 OK)
```json
{
  "message": "OTP sent successfully"
}
```

### POST /auth/otp/verify
Verify OTP and login/signup.

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response:** (200 OK)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "john@example.com",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## User Management Routes

### GET /users
Get all users (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "role": "user",
    "createdAt": "2024-01-10T12:00:00.000Z",
    "updatedAt": "2024-01-10T12:00:00.000Z"
  }
]
```

### GET /users/:id
Get user by ID (authenticated users can only access their own data).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "role": "user",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

### PUT /users/:id
Update user data (users can only update their own data, admins can update any user).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```json
{
  "name": "John Smith",
  "phone": "+1987654321"
}
```

**Response:** (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1987654321",
  "role": "user",
  "createdAt": "2024-01-10T12:00:00.000Z",
  "updatedAt": "2024-01-10T12:00:00.000Z"
}
```

### DELETE /users/:id
Delete a user (admin only).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:** (204 No Content)

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "errors": [
    {
      "code": "invalid_type",
      "path": ["body", "email"],
      "message": "Invalid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Please authenticate"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```