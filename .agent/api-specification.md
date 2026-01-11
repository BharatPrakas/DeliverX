# DeliverX Backend API Specification

## Overview
This document outlines all the API endpoints and JSON data structures required for the DeliverX application.

---

## 1. Authentication

### POST `/api/auth/login`
**Request:**
```json
{
  "username": "driver123",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "usr_001",
    "name": "Rajesh Kumar",
    "role": "driver",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here"
  }
}
```

---

## 2. Dashboard

### GET `/api/tasks/active`
Get the currently active task for the logged-in driver.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicleNumber": "TN 30 BT 1616",
    "type": "Pickup & Delivery",
    "status": "Pending",
    "advanceAmount": 3000,
    "supervisor": "Murugan",
    "date": "2025-01-07T00:00:00Z",
    "totalCustomers": 6,
    "totalBoxes": 21,
    "helper": {
      "id": "hlp_001",
      "name": "Arun Kumar",
      "role": "Helper",
      "phone": "+91 98765 43210"
    },
    "remarks": "Handle with care",
    "startingKm": null,
    "endingKm": null,
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  }
}
```

### GET `/api/tasks/history?page=1&limit=10`
Get completed tasks history.

**Response:**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 5,
        "vehicleNumber": "TN 30 BT 1616",
        "type": "Pickup & Delivery",
        "status": "Completed",
        "advanceAmount": 3000,
        "supervisor": "Murugan",
        "date": "2025-01-05T00:00:00Z",
        "totalCustomers": 5,
        "totalBoxes": 18,
        "startingKm": 12345,
        "endingKm": 12545,
        "totalDistance": 200,
        "completedAt": "2025-01-05T18:30:00Z"
      },
      {
        "id": 4,
        "vehicleNumber": "TN 30 BT 1515",
        "type": "Delivery Only",
        "status": "Completed",
        "advanceAmount": 2500,
        "supervisor": "Kumar",
        "date": "2025-01-04T00:00:00Z",
        "totalCustomers": 4,
        "totalBoxes": 12,
        "startingKm": 11900,
        "endingKm": 12100,
        "totalDistance": 200,
        "completedAt": "2025-01-04T17:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10
    }
  }
}
```

---

## 3. Task Detail

### GET `/api/tasks/:id`
Get detailed information about a specific task.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "vehicleNumber": "TN 30 BT 1616",
    "type": "Pickup & Delivery",
    "status": "Pending",
    "advanceAmount": 3000,
    "supervisor": "Murugan",
    "supervisorPhone": "+91 98765 12345",
    "date": "2025-01-07T00:00:00Z",
    "totalCustomers": 6,
    "totalBoxes": 21,
    "helper": {
      "id": "hlp_001",
      "name": "Arun Kumar",
      "role": "Helper",
      "phone": "+91 98765 43210"
    },
    "remarks": "Handle with care",
    "startingKm": null,
    "endingKm": null,
    "supplier": {
      "id": "sup_001",
      "name": "ABC Suppliers",
      "address": "123 Market Street, Chennai",
      "phone": "+91 98765 00001"
    },
    "deliveries": [
      {
        "id": 101,
        "customerName": "Ramesh Stores",
        "address": "45 Gandhi Road, T Nagar, Chennai - 600017",
        "phone": "+91 98765 11111",
        "items": 4,
        "boxes": 4,
        "status": "Pending"
      },
      {
        "id": 102,
        "customerName": "Kumar Traders",
        "address": "78 Anna Salai, Nungambakkam, Chennai - 600034",
        "phone": "+91 98765 22222",
        "items": 3,
        "boxes": 3,
        "status": "Pending"
      }
    ],
    "createdAt": "2025-01-06T10:00:00Z",
    "updatedAt": "2025-01-06T10:00:00Z"
  }
}
```

### POST `/api/tasks/:id/start`
Start a task by recording the starting odometer reading.

**Request:**
```json
{
  "startingKm": 12345
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task started successfully",
  "data": {
    "id": 1,
    "status": "In Progress",
    "startingKm": 12345,
    "startedAt": "2025-01-07T08:30:00Z"
  }
}
```

---

## 4. Purchase

### GET `/api/tasks/:taskId/purchase`
Get purchase/supplier information for a task.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": 1,
    "supplier": {
      "id": "sup_001",
      "name": "ABC Suppliers",
      "address": "123 Market Street, Chennai - 600001",
      "phone": "+91 98765 00001",
      "contactPerson": "Vijay"
    },
    "items": [
      {
        "id": "item_001",
        "name": "Product A",
        "quantity": 10,
        "boxes": 5
      },
      {
        "id": "item_002",
        "name": "Product B",
        "quantity": 8,
        "boxes": 4
      }
    ],
    "totalBoxes": 21,
    "purchaseStatus": "Pending"
  }
}
```

### POST `/api/tasks/:taskId/purchase/confirm`
Mark items as purchased from supplier.

**Request:**
```json
{
  "purchasedAt": "2025-01-07T09:15:00Z",
  "notes": "All items collected"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Purchase confirmed successfully",
  "data": {
    "taskId": 1,
    "purchaseStatus": "Completed",
    "purchasedAt": "2025-01-07T09:15:00Z"
  }
}
```

---

## 5. Delivery List

### GET `/api/tasks/:taskId/deliveries`
Get list of all deliveries for a task.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": 1,
    "deliveries": [
      {
        "id": 101,
        "sequenceNumber": 1,
        "customerName": "Ramesh Stores",
        "address": "45 Gandhi Road, T Nagar, Chennai - 600017",
        "phone": "+91 98765 11111",
        "items": 4,
        "boxes": 4,
        "status": "Pending",
        "amount": null,
        "deliveredAt": null
      },
      {
        "id": 102,
        "sequenceNumber": 2,
        "customerName": "Kumar Traders",
        "address": "78 Anna Salai, Nungambakkam, Chennai - 600034",
        "phone": "+91 98765 22222",
        "items": 3,
        "boxes": 3,
        "status": "Delivered",
        "amount": 2500,
        "deliveredAt": "2025-01-07T10:30:00Z"
      },
      {
        "id": 103,
        "sequenceNumber": 3,
        "customerName": "Lakshmi Enterprises",
        "address": "12 Mount Road, Teynampet, Chennai - 600018",
        "phone": "+91 98765 33333",
        "items": 5,
        "boxes": 5,
        "status": "Pending",
        "amount": null,
        "deliveredAt": null
      },
      {
        "id": 104,
        "sequenceNumber": 4,
        "customerName": "Siva Textiles",
        "address": "89 Poonamallee High Road, Chennai - 600084",
        "phone": "+91 98765 44444",
        "items": 2,
        "boxes": 2,
        "status": "Pending",
        "amount": null,
        "deliveredAt": null
      },
      {
        "id": 105,
        "sequenceNumber": 5,
        "customerName": "Anand Provisions",
        "address": "56 Velachery Main Road, Chennai - 600042",
        "phone": "+91 98765 55555",
        "items": 4,
        "boxes": 4,
        "status": "Pending",
        "amount": null,
        "deliveredAt": null
      },
      {
        "id": 106,
        "sequenceNumber": 6,
        "customerName": "Priya Stores",
        "address": "34 OMR Road, Thoraipakkam, Chennai - 600097",
        "phone": "+91 98765 66666",
        "items": 3,
        "boxes": 3,
        "status": "Pending",
        "amount": null,
        "deliveredAt": null
      }
    ],
    "stats": {
      "total": 6,
      "completed": 1,
      "pending": 5,
      "progress": 17
    }
  }
}
```

---

## 6. Delivery Receipt

### GET `/api/deliveries/:id`
Get details of a specific delivery.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 101,
    "taskId": 1,
    "sequenceNumber": 1,
    "customer": {
      "id": "cust_001",
      "name": "Ramesh Stores",
      "address": "45 Gandhi Road, T Nagar, Chennai - 600017",
      "phone": "+91 98765 11111",
      "contactPerson": "Ramesh"
    },
    "items": [
      {
        "id": "item_001",
        "name": "Product A",
        "quantity": 2,
        "boxes": 2
      },
      {
        "id": "item_002",
        "name": "Product B",
        "quantity": 2,
        "boxes": 2
      }
    ],
    "totalItems": 4,
    "totalBoxes": 4,
    "status": "Pending",
    "amount": null,
    "receiptImage": null,
    "deliveredAt": null,
    "notes": null
  }
}
```

### POST `/api/deliveries/:id/complete`
Mark a delivery as completed.

**Request:**
```json
{
  "amount": 2500,
  "receiptImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "deliveredAt": "2025-01-07T10:30:00Z",
  "notes": "Delivered successfully"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Delivery completed successfully",
  "data": {
    "id": 101,
    "status": "Delivered",
    "amount": 2500,
    "receiptImageUrl": "https://storage.example.com/receipts/receipt_101.jpg",
    "deliveredAt": "2025-01-07T10:30:00Z"
  }
}
```

---

## 7. Expenses

### GET `/api/tasks/:taskId/expenses`
Get all expenses for a task.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": 1,
    "advanceAmount": 3000,
    "expenses": [
      {
        "id": "exp_001",
        "category": "diesel",
        "title": "Bhart Petrol",
        "amount": 2000,
        "time": "2025-01-07T11:00:00Z",
        "receiptImage": "https://storage.example.com/expenses/exp_001.jpg",
        "notes": "Full tank"
      },
      {
        "id": "exp_002",
        "category": "food",
        "title": "Lunch",
        "amount": 300,
        "time": "2025-01-07T13:00:00Z",
        "receiptImage": null,
        "notes": null
      },
      {
        "id": "exp_003",
        "category": "toll",
        "title": "Highway Toll",
        "amount": 150,
        "time": "2025-01-07T14:30:00Z",
        "receiptImage": "https://storage.example.com/expenses/exp_003.jpg",
        "notes": null
      }
    ],
    "summary": {
      "totalExpenses": 2450,
      "remaining": 550,
      "breakdown": {
        "diesel": 2000,
        "food": 300,
        "toll": 150,
        "labour": 0,
        "other": 0
      }
    }
  }
}
```

### POST `/api/tasks/:taskId/expenses`
Add a new expense.

**Request:**
```json
{
  "category": "diesel",
  "title": "Bhart Petrol",
  "amount": 2000,
  "time": "2025-01-07T11:00:00Z",
  "receiptImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "notes": "Full tank"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Expense added successfully",
  "data": {
    "id": "exp_001",
    "category": "diesel",
    "title": "Bhart Petrol",
    "amount": 2000,
    "time": "2025-01-07T11:00:00Z",
    "receiptImageUrl": "https://storage.example.com/expenses/exp_001.jpg"
  }
}
```

---

## 8. Trip Summary

### GET `/api/tasks/:taskId/summary`
Get complete trip summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "taskId": 1,
    "vehicleNumber": "TN 30 BT 1616",
    "startingKm": 12345,
    "endingKm": null,
    "totalDistance": null,
    "startedAt": "2025-01-07T08:30:00Z",
    "completedAt": null,
    "
    
    "deliverySummary": {
      "totalCustomers": 6,
      "completedDeliveries": 5,
      "pendingDeliveries": 1,
      "totalCashCollected": 12500,
      "deliveries": [
        {
          "id": 101,
          "customerName": "Ramesh Stores",
          "amount": 2500,
          "status": "Delivered"
        },
        {
          "id": 102,
          "customerName": "Kumar Traders",
          "amount": 2000,
          "status": "Delivered"
        },
        {
          "id": 103,
          "customerName": "Lakshmi Enterprises",
          "amount": 3200,
          "status": "Delivered"
        },
        {
          "id": 104,
          "customerName": "Siva Textiles",
          "amount": 1500,
          "status": "Delivered"
        },
        {
          "id": 105,
          "customerName": "Anand Provisions",
          "amount": 3300,
          "status": "Delivered"
        },
        {
          "id": 106,
          "customerName": "Priya Stores",
          "amount": 0,
          "status": "Pending"
        }
      ]
    },
    "expenseSummary": {
      "advanceAmount": 3000,
      "totalExpenses": 2450,
      "remaining": 550,
      "breakdown": {
        "diesel": 2000,
        "food": 300,
        "toll": 150,
        "labour": 0,
        "other": 0
      },
      "expenses": [
        {
          "id": "exp_001",
          "category": "diesel",
          "title": "Bhart Petrol",
          "amount": 2000,
          "time": "2025-01-07T11:00:00Z"
        },
        {
          "id": "exp_002",
          "category": "food",
          "title": "Lunch",
          "amount": 300,
          "time": "2025-01-07T13:00:00Z"
        },
        {
          "id": "exp_003",
          "category": "toll",
          "title": "Highway Toll",
          "amount": 150,
          "time": "2025-01-07T14:30:00Z"
        }
      ]
    },
    "finalSummary": {
      "advanceReceived": 3000,
      "cashFromCustomers": 12500,
      "totalExpenses": 2450,
      "cashInHand": 13050
    }
  }
}
```

### POST `/api/tasks/:taskId/complete`
Complete a task with ending odometer reading.

**Request:**
```json
{
  "endingKm": 12545,
  "completedAt": "2025-01-07T18:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Task completed successfully",
  "data": {
    "taskId": 1,
    "status": "Completed",
    "startingKm": 12345,
    "endingKm": 12545,
    "totalDistance": 200,
    "startedAt": "2025-01-07T08:30:00Z",
    "completedAt": "2025-01-07T18:00:00Z",
    "duration": "9h 30m",
    "finalCashInHand": 13050
  }
}
```

---

## 9. File Upload

### POST `/api/upload/receipt`
Upload a receipt image.

**Request (multipart/form-data):**
```
file: [binary image data]
type: "delivery" | "expense"
referenceId: "101" or "exp_001"
```

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "fileId": "file_12345",
    "url": "https://storage.example.com/receipts/receipt_101.jpg",
    "thumbnailUrl": "https://storage.example.com/receipts/thumb_receipt_101.jpg",
    "uploadedAt": "2025-01-07T10:30:00Z"
  }
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Starting KM must be a positive number",
    "details": {
      "field": "startingKm",
      "value": -100
    }
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` - Invalid or expired token
- `FORBIDDEN` - User doesn't have permission
- `NOT_FOUND` - Resource not found
- `INVALID_INPUT` - Validation error
- `DUPLICATE_ENTRY` - Resource already exists
- `SERVER_ERROR` - Internal server error

---

## Data Validation Rules

### Task
- `vehicleNumber`: Required, alphanumeric with spaces, max 20 chars
- `advanceAmount`: Required, positive number, max 100000
- `startingKm`: Required when starting, positive number
- `endingKm`: Required when completing, must be > startingKm

### Delivery
- `amount`: Optional, positive number, max 1000000
- `receiptImage`: Optional, base64 encoded image, max 5MB

### Expense
- `category`: Required, one of: diesel, food, toll, labour, other
- `amount`: Required, positive number, max 100000
- `title`: Required, max 100 chars

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

**Response includes:**
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Authentication

All API requests (except login) require authentication:

**Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Refresh:**
```
POST /api/auth/refresh
{
  "refreshToken": "refresh_token_here"
}
```

---

## WebSocket Events (Optional for Real-time Updates)

### Connection
```javascript
ws://api.example.com/ws?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Events

**Task Updated:**
```json
{
  "event": "task.updated",
  "data": {
    "taskId": 1,
    "status": "In Progress",
    "updatedAt": "2025-01-07T08:30:00Z"
  }
}
```

**Delivery Completed:**
```json
{
  "event": "delivery.completed",
  "data": {
    "deliveryId": 101,
    "taskId": 1,
    "amount": 2500
  }
}
```

---

## Rate Limiting

- **Authenticated requests**: 1000 requests per hour
- **File uploads**: 100 uploads per hour
- **Login attempts**: 5 attempts per 15 minutes

**Rate limit headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641567600
```

---

## Notes for Backend Implementation

1. **Image Storage**: Use cloud storage (AWS S3, Google Cloud Storage) for receipt images
2. **Database**: Recommended to use PostgreSQL or MongoDB
3. **Caching**: Implement Redis for caching frequently accessed data
4. **Security**: 
   - Hash passwords with bcrypt
   - Validate all inputs
   - Sanitize file uploads
   - Implement CORS properly
5. **Logging**: Log all API requests and errors
6. **Backup**: Regular database backups
7. **Monitoring**: Set up error tracking (Sentry, etc.)
