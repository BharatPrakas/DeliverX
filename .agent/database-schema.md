# DeliverX Database Schema

## Overview
This document outlines the database schema for the DeliverX application.

---

## Tables

### 1. users
Stores user/driver information.

```sql
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'driver',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": "usr_001",
  "username": "driver123",
  "password_hash": "$2b$10$...",
  "name": "Rajesh Kumar",
  "phone": "+91 98765 12345",
  "role": "driver",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 2. tasks
Main task/trip information.

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  advance_amount DECIMAL(10,2) NOT NULL,
  supervisor VARCHAR(100),
  supervisor_phone VARCHAR(20),
  task_date DATE NOT NULL,
  total_customers INT DEFAULT 0,
  total_boxes INT DEFAULT 0,
  helper_id VARCHAR(50),
  remarks TEXT,
  starting_km INT,
  ending_km INT,
  total_distance INT,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (helper_id) REFERENCES helpers(id)
);
```

**Example Data:**
```json
{
  "id": 1,
  "user_id": "usr_001",
  "vehicle_number": "TN 30 BT 1616",
  "type": "Pickup & Delivery",
  "status": "In Progress",
  "advance_amount": 3000.00,
  "supervisor": "Murugan",
  "supervisor_phone": "+91 98765 12345",
  "task_date": "2025-01-07",
  "total_customers": 6,
  "total_boxes": 21,
  "helper_id": "hlp_001",
  "remarks": "Handle with care",
  "starting_km": 12345,
  "ending_km": null,
  "total_distance": null,
  "started_at": "2025-01-07T08:30:00Z",
  "completed_at": null,
  "created_at": "2025-01-06T10:00:00Z",
  "updated_at": "2025-01-07T08:30:00Z"
}
```

---

### 3. helpers
Helper/assistant information.

```sql
CREATE TABLE helpers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) DEFAULT 'Helper',
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": "hlp_001",
  "name": "Arun Kumar",
  "role": "Helper",
  "phone": "+91 98765 43210",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 4. suppliers
Supplier information.

```sql
CREATE TABLE suppliers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  contact_person VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": "sup_001",
  "name": "ABC Suppliers",
  "address": "123 Market Street, Chennai - 600001",
  "phone": "+91 98765 00001",
  "contact_person": "Vijay",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 5. customers
Customer information.

```sql
CREATE TABLE customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  contact_person VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": "cust_001",
  "name": "Ramesh Stores",
  "address": "45 Gandhi Road, T Nagar, Chennai - 600017",
  "phone": "+91 98765 11111",
  "contact_person": "Ramesh",
  "is_active": true,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

---

### 6. deliveries
Individual delivery information.

```sql
CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  customer_id VARCHAR(50) NOT NULL,
  sequence_number INT NOT NULL,
  items INT DEFAULT 0,
  boxes INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'Pending',
  amount DECIMAL(10,2),
  receipt_image_url TEXT,
  delivered_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Example Data:**
```json
{
  "id": 101,
  "task_id": 1,
  "customer_id": "cust_001",
  "sequence_number": 1,
  "items": 4,
  "boxes": 4,
  "status": "Delivered",
  "amount": 2500.00,
  "receipt_image_url": "https://storage.example.com/receipts/receipt_101.jpg",
  "delivered_at": "2025-01-07T10:30:00Z",
  "notes": "Delivered successfully",
  "created_at": "2025-01-06T10:00:00Z",
  "updated_at": "2025-01-07T10:30:00Z"
}
```

---

### 7. expenses
Expense tracking.

```sql
CREATE TABLE expenses (
  id VARCHAR(50) PRIMARY KEY,
  task_id INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  time TIMESTAMP NOT NULL,
  receipt_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

**Example Data:**
```json
{
  "id": "exp_001",
  "task_id": 1,
  "category": "diesel",
  "title": "Bhart Petrol",
  "amount": 2000.00,
  "time": "2025-01-07T11:00:00Z",
  "receipt_image_url": "https://storage.example.com/expenses/exp_001.jpg",
  "notes": "Full tank",
  "created_at": "2025-01-07T11:00:00Z",
  "updated_at": "2025-01-07T11:00:00Z"
}
```

---

### 8. task_items
Items associated with a task (for purchase tracking).

```sql
CREATE TABLE task_items (
  id VARCHAR(50) PRIMARY KEY,
  task_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  quantity INT NOT NULL,
  boxes INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

**Example Data:**
```json
{
  "id": "item_001",
  "task_id": 1,
  "name": "Product A",
  "quantity": 10,
  "boxes": 5,
  "created_at": "2025-01-06T10:00:00Z",
  "updated_at": "2025-01-06T10:00:00Z"
}
```

---

### 9. purchases
Purchase confirmation tracking.

```sql
CREATE TABLE purchases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT NOT NULL,
  supplier_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  purchased_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);
```

**Example Data:**
```json
{
  "id": 1,
  "task_id": 1,
  "supplier_id": "sup_001",
  "status": "Completed",
  "purchased_at": "2025-01-07T09:15:00Z",
  "notes": "All items collected",
  "created_at": "2025-01-06T10:00:00Z",
  "updated_at": "2025-01-07T09:15:00Z"
}
```

---

### 10. files
File upload tracking.

```sql
CREATE TABLE files (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  reference_id VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INT,
  mime_type VARCHAR(50),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": "file_12345",
  "type": "delivery_receipt",
  "reference_id": "101",
  "url": "https://storage.example.com/receipts/receipt_101.jpg",
  "thumbnail_url": "https://storage.example.com/receipts/thumb_receipt_101.jpg",
  "file_size": 245678,
  "mime_type": "image/jpeg",
  "uploaded_at": "2025-01-07T10:30:00Z"
}
```

---

## Indexes

```sql
-- Users
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Tasks
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_task_date ON tasks(task_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Deliveries
CREATE INDEX idx_deliveries_task_id ON deliveries(task_id);
CREATE INDEX idx_deliveries_customer_id ON deliveries(customer_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);

-- Expenses
CREATE INDEX idx_expenses_task_id ON expenses(task_id);
CREATE INDEX idx_expenses_category ON expenses(category);

-- Files
CREATE INDEX idx_files_type_reference ON files(type, reference_id);
```

---

## Relationships

```
users (1) ----< (M) tasks
helpers (1) ----< (M) tasks
tasks (1) ----< (M) deliveries
tasks (1) ----< (M) expenses
tasks (1) ----< (M) task_items
tasks (1) ----< (M) purchases
customers (1) ----< (M) deliveries
suppliers (1) ----< (M) purchases
```

---

## Seed Data Script

```sql
-- Insert sample user
INSERT INTO users (id, username, password_hash, name, phone, role)
VALUES ('usr_001', 'driver123', '$2b$10$...', 'Rajesh Kumar', '+91 98765 12345', 'driver');

-- Insert sample helper
INSERT INTO helpers (id, name, role, phone)
VALUES ('hlp_001', 'Arun Kumar', 'Helper', '+91 98765 43210');

-- Insert sample supplier
INSERT INTO suppliers (id, name, address, phone, contact_person)
VALUES ('sup_001', 'ABC Suppliers', '123 Market Street, Chennai - 600001', '+91 98765 00001', 'Vijay');

-- Insert sample customers
INSERT INTO customers (id, name, address, phone, contact_person) VALUES
('cust_001', 'Ramesh Stores', '45 Gandhi Road, T Nagar, Chennai - 600017', '+91 98765 11111', 'Ramesh'),
('cust_002', 'Kumar Traders', '78 Anna Salai, Nungambakkam, Chennai - 600034', '+91 98765 22222', 'Kumar'),
('cust_003', 'Lakshmi Enterprises', '12 Mount Road, Teynampet, Chennai - 600018', '+91 98765 33333', 'Lakshmi'),
('cust_004', 'Siva Textiles', '89 Poonamallee High Road, Chennai - 600084', '+91 98765 44444', 'Siva'),
('cust_005', 'Anand Provisions', '56 Velachery Main Road, Chennai - 600042', '+91 98765 55555', 'Anand'),
('cust_006', 'Priya Stores', '34 OMR Road, Thoraipakkam, Chennai - 600097', '+91 98765 66666', 'Priya');

-- Insert sample task
INSERT INTO tasks (user_id, vehicle_number, type, status, advance_amount, supervisor, supervisor_phone, task_date, total_customers, total_boxes, helper_id, remarks)
VALUES ('usr_001', 'TN 30 BT 1616', 'Pickup & Delivery', 'Pending', 3000.00, 'Murugan', '+91 98765 12345', '2025-01-07', 6, 21, 'hlp_001', 'Handle with care');

-- Insert sample deliveries
INSERT INTO deliveries (task_id, customer_id, sequence_number, items, boxes, status) VALUES
(1, 'cust_001', 1, 4, 4, 'Pending'),
(1, 'cust_002', 2, 3, 3, 'Pending'),
(1, 'cust_003', 3, 5, 5, 'Pending'),
(1, 'cust_004', 4, 2, 2, 'Pending'),
(1, 'cust_005', 5, 4, 4, 'Pending'),
(1, 'cust_006', 6, 3, 3, 'Pending');
```

---

## MongoDB Alternative Schema

If using MongoDB, here's the document structure:

### Task Document
```json
{
  "_id": "task_001",
  "userId": "usr_001",
  "vehicleNumber": "TN 30 BT 1616",
  "type": "Pickup & Delivery",
  "status": "In Progress",
  "advanceAmount": 3000,
  "supervisor": {
    "name": "Murugan",
    "phone": "+91 98765 12345"
  },
  "taskDate": "2025-01-07T00:00:00Z",
  "totalCustomers": 6,
  "totalBoxes": 21,
  "helper": {
    "id": "hlp_001",
    "name": "Arun Kumar",
    "role": "Helper",
    "phone": "+91 98765 43210"
  },
  "remarks": "Handle with care",
  "odometer": {
    "starting": 12345,
    "ending": null,
    "totalDistance": null
  },
  "timestamps": {
    "started": "2025-01-07T08:30:00Z",
    "completed": null,
    "created": "2025-01-06T10:00:00Z",
    "updated": "2025-01-07T08:30:00Z"
  },
  "deliveries": [
    {
      "id": 101,
      "sequenceNumber": 1,
      "customer": {
        "id": "cust_001",
        "name": "Ramesh Stores",
        "address": "45 Gandhi Road, T Nagar, Chennai - 600017",
        "phone": "+91 98765 11111"
      },
      "items": 4,
      "boxes": 4,
      "status": "Pending",
      "amount": null,
      "receiptImageUrl": null,
      "deliveredAt": null,
      "notes": null
    }
  ],
  "expenses": [
    {
      "id": "exp_001",
      "category": "diesel",
      "title": "Bhart Petrol",
      "amount": 2000,
      "time": "2025-01-07T11:00:00Z",
      "receiptImageUrl": "https://storage.example.com/expenses/exp_001.jpg",
      "notes": "Full tank"
    }
  ],
  "purchase": {
    "supplier": {
      "id": "sup_001",
      "name": "ABC Suppliers",
      "address": "123 Market Street, Chennai - 600001",
      "phone": "+91 98765 00001"
    },
    "status": "Completed",
    "purchasedAt": "2025-01-07T09:15:00Z",
    "notes": "All items collected"
  }
}
```

---

## Notes

1. **Primary Keys**: Use UUIDs for distributed systems or auto-increment for simpler setups
2. **Timestamps**: Always store in UTC
3. **Soft Deletes**: Consider adding `deleted_at` column for soft deletes
4. **Audit Trail**: Consider adding audit tables for tracking changes
5. **Decimal Precision**: Use DECIMAL(10,2) for money to avoid floating-point issues
6. **Indexes**: Add indexes on frequently queried columns
7. **Foreign Keys**: Use ON DELETE CASCADE where appropriate
