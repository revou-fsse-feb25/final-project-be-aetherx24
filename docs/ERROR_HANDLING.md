# 🚨 Error Handling Documentation

This document provides comprehensive information about error handling in the Learning Management System (LMS) backend, including common error scenarios, error codes, and best practices for frontend integration.

## 📋 Table of Contents

- [🔍 Error Overview](#-error-overview)
- [📊 HTTP Status Codes](#-http-status-codes)
- [🚨 Common Error Scenarios](#-common-error-scenarios)
- [🔐 Authentication Errors](#-authentication-errors)
- [👥 Authorization Errors](#-authorization-errors)
- [📝 Validation Errors](#-validation-errors)
- [🗄️ Database Errors](#️-database-errors)
- [🌐 CORS Errors](#-cors-errors)
- [📱 Frontend Integration](#-frontend-integration)
- [🛠️ Error Handling Best Practices](#️-error-handling-best-practices)
- [🔧 Troubleshooting Guide](#-troubleshooting-guide)

---

## 🔍 Error Overview

The LMS backend implements a standardized error handling system that provides consistent error responses across all endpoints. All errors follow a uniform structure for easy frontend integration.

### Standard Error Response Format

```json
{
  "message": "Human-readable error description",
  "error": "Error type identifier",
  "statusCode": 400,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/users",
  "details": {
    "field": "Additional error details if applicable"
  }
}
```

### Error Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Human-readable error description |
| `error` | string | Error type identifier (e.g., "Bad Request", "Unauthorized") |
| `statusCode` | number | HTTP status code |
| `timestamp` | string | ISO timestamp of when the error occurred |
| `path` | string | API endpoint that generated the error |
| `details` | object | Additional error context (optional) |

---

## 📊 HTTP Status Codes

The backend uses standard HTTP status codes to indicate the nature of errors:

### 4xx Client Errors

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| `400` | Bad Request | Invalid input data, missing required fields |
| `401` | Unauthorized | Missing or invalid JWT token |
| `403` | Forbidden | Valid token but insufficient permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Resource conflict (e.g., duplicate email) |
| `422` | Unprocessable Entity | Validation errors |

### 5xx Server Errors

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| `500` | Internal Server Error | Unexpected server error |
| `502` | Bad Gateway | Database connection issues |
| `503` | Service Unavailable | Service temporarily unavailable |

---

## 🚨 Common Error Scenarios

### 1. Authentication Required

**When**: Accessing protected endpoints without a valid JWT token

**Response**:
```json
{
  "message": "Unauthorized - JWT token required",
  "error": "Unauthorized",
  "statusCode": 401,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/dashboard"
}
```

**Frontend Action**: Redirect to login page

### 2. Token Expired

**When**: JWT token has expired

**Response**:
```json
{
  "message": "JWT token has expired",
  "error": "Unauthorized",
  "statusCode": 401,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/dashboard"
}
```

**Frontend Action**: Clear stored token and redirect to login

### 3. Insufficient Permissions

**When**: User lacks required role for the endpoint

**Response**:
```json
{
  "message": "Admin access required",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/users"
}
```

**Frontend Action**: Show access denied message or redirect to appropriate page

---

## 🔐 Authentication Errors

### Login Failures

#### Invalid Credentials
```json
{
  "message": "Invalid email or password",
  "error": "Unauthorized",
  "statusCode": 401,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

#### Account Not Found
```json
{
  "message": "User account not found",
  "error": "Not Found",
  "statusCode": 404,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

### Registration Issues

#### Duplicate Email
```json
{
  "message": "User with this email already exists",
  "error": "Conflict",
  "statusCode": 409,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/auth/register"
}
```

#### Invalid Registration Data
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/auth/register",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## 👥 Authorization Errors

### Role-Based Access Control

#### Student Accessing Teacher Endpoint
```json
{
  "message": "Teacher or Admin access required",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/assignments"
}
```

#### Non-Admin User Management
```json
{
  "message": "Admin access required",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/users/123/role"
}
```

### Resource Ownership

#### Grading Another Teacher's Assignment
```json
{
  "message": "Only the course teacher can grade submissions",
  "error": "Forbidden",
  "statusCode": 403,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/submissions/456/grade"
}
```

---

## 📝 Validation Errors

### Input Validation Failures

#### Missing Required Fields
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/courses",
  "details": {
    "title": "Title is required",
    "code": "Course code is required"
  }
}
```

#### Invalid Data Types
```json
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/assignments",
  "details": {
    "maxScore": "Max score must be a positive number",
    "dueDate": "Due date must be a valid date"
  }
}
```

#### Business Logic Validation
```json
{
  "message": "Score cannot exceed maximum possible score",
  "error": "Bad Request",
  "statusCode": 400,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/submissions/123/grade"
}
```

---

## 🗄️ Database Errors

### Resource Not Found

#### Course Not Found
```json
{
  "message": "Course not found",
  "error": "Not Found",
  "statusCode": 404,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/courses/invalid-id"
}
```

#### User Not Found
```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/users/999"
}
```

### Constraint Violations

#### Foreign Key Constraint
```json
{
  "message": "Cannot delete course with existing enrollments",
  "error": "Conflict",
  "statusCode": 409,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/courses/123"
}
```

#### Unique Constraint
```json
{
  "message": "Course code already exists",
  "error": "Conflict",
  "statusCode": 409,
  "timestamp": "2025-01-23T10:30:00.000Z",
  "path": "/api/v1/courses"
}
```

---

## 🌐 CORS Errors

### Cross-Origin Issues

#### Missing CORS Headers
```
Access to fetch at 'https://api.example.com/api/v1/auth/login' 
from origin 'https://frontend.example.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Backend Solution**: Ensure CORS is properly configured in `main.ts`

**Frontend Solution**: Check API base URL configuration

---

## 📱 Frontend Integration

### Error Handling Patterns

#### 1. Global Error Handler

```typescript
// apiClient.ts
class ApiClient {
  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle specific error types
      switch (response.status) {
        case 401:
          if (errorData.message.includes('expired')) {
            this.handleTokenExpired();
          } else {
            this.handleUnauthorized();
          }
          break;
        case 403:
          this.handleForbidden();
          break;
        case 404:
          this.handleNotFound();
          break;
        case 409:
          this.handleConflict(errorData);
          break;
        case 422:
          this.handleValidationError(errorData);
          break;
        default:
          this.handleGenericError(errorData);
      }
      
      throw new Error(errorData.message);
    }
    
    return response.json();
  }
  
  private handleTokenExpired() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  private handleUnauthorized() {
    // Redirect to login
  }
  
  private handleForbidden() {
    // Show access denied message
  }
  
  private handleNotFound() {
    // Show 404 page or message
  }
  
  private handleConflict(errorData: any) {
    // Handle duplicate resources
  }
  
  private handleValidationError(errorData: any) {
    // Display field-specific validation errors
  }
  
  private handleGenericError(errorData: any) {
    // Show generic error message
  }
}
```

#### 2. React Hook for Error Handling

```typescript
// useApiError.ts
import { useState, useCallback } from 'react';

interface ApiError {
  message: string;
  error: string;
  statusCode: number;
  details?: Record<string, string>;
}

export const useApiError = () => {
  const [error, setError] = useState<ApiError | null>(null);
  
  const handleError = useCallback((errorData: ApiError) => {
    setError(errorData);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError
  };
};
```

#### 3. Error Display Component

```typescript
// ErrorDisplay.tsx
import React from 'react';

interface ErrorDisplayProps {
  error: {
    message: string;
    details?: Record<string, string>;
  } | null;
  onClose?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose }) => {
  if (!error) return null;
  
  return (
    <div className="error-alert">
      <div className="error-header">
        <span className="error-icon">⚠️</span>
        <span className="error-message">{error.message}</span>
        {onClose && (
          <button onClick={onClose} className="error-close">×</button>
        )}
      </div>
      
      {error.details && (
        <div className="error-details">
          {Object.entries(error.details).map(([field, message]) => (
            <div key={field} className="error-field">
              <strong>{field}:</strong> {message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 🛠️ Error Handling Best Practices

### Backend Best Practices

1. **Consistent Error Format**: Always return errors in the standard format
2. **Meaningful Messages**: Provide clear, actionable error messages
3. **Appropriate Status Codes**: Use correct HTTP status codes
4. **Logging**: Log all errors for debugging
5. **Security**: Don't expose sensitive information in error messages

### Frontend Best Practices

1. **Global Error Handler**: Implement centralized error handling
2. **User-Friendly Messages**: Translate technical errors to user-friendly language
3. **Error Recovery**: Provide clear next steps for users
4. **Retry Logic**: Implement retry mechanisms for transient errors
5. **Error Boundaries**: Use React error boundaries for component errors

### Error Message Guidelines

#### ✅ Good Error Messages
- "Password must be at least 8 characters long"
- "Course 'CS101' is already full"
- "You don't have permission to access this resource"

#### ❌ Bad Error Messages
- "Validation failed"
- "Internal server error"
- "Something went wrong"

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### 1. "Authentication expired" Error

**Symptoms**: User gets logged out unexpectedly

**Possible Causes**:
- JWT token expired
- Invalid token format
- Backend JWT secret changed

**Solutions**:
- Check token expiration time
- Verify JWT secret configuration
- Implement token refresh mechanism

#### 2. CORS Errors

**Symptoms**: Frontend can't communicate with backend

**Possible Causes**:
- CORS not configured on backend
- Wrong API base URL
- Missing CORS headers

**Solutions**:
- Verify CORS configuration in `main.ts`
- Check frontend API configuration
- Ensure proper CORS headers

#### 3. 404 Errors

**Symptoms**: Endpoints return "Not Found"

**Possible Causes**:
- Wrong API path
- Missing global prefix (`/api/v1`)
- Endpoint not implemented

**Solutions**:
- Verify API endpoint paths
- Check global prefix configuration
- Ensure endpoint is implemented

#### 4. Validation Errors

**Symptoms**: Form submissions fail with validation errors

**Possible Causes**:
- Missing required fields
- Invalid data types
- Business rule violations

**Solutions**:
- Check form validation on frontend
- Verify backend validation rules
- Review business logic requirements

### Debug Mode

Enable debug logging to get more detailed error information:

```typescript
// main.ts
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
}
```

---

## 📚 Additional Resources

- [NestJS Exception Handling](https://docs.nestjs.com/exception-filters)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JWT Best Practices](https://jwt.io/introduction)
- [CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Note**: This documentation should be updated whenever new error types or handling patterns are added to the system.
