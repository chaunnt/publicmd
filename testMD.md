
# 🚀 MyApp API Documentation

> **Base URL:** `https://api.myapp.com/v1`
>
> **Version:** 1.0.0 &nbsp;|&nbsp; **Last Updated:** March 25, 2026

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Create User](#create-user)
  - [Login](#login)
  - [Create Order](#create-order)
- [Error Codes](#error-codes)
- [Playground](#playground)

---

## Authentication

All API requests (except `/auth/login`) require a **Bearer Token** in the `Authorization` header.

| Header          | Value                  | Required |
|-----------------|------------------------|----------|
| `Authorization` | `Bearer <access_token>` | ✅ Yes   |
| `Content-Type`  | `application/json`      | ✅ Yes   |

### How to Obtain a Token

1. Call the [Login](#login) endpoint with your credentials.
2. Copy the `access_token` from the response.
3. Include it in all subsequent requests.

> ⚠️ Tokens expire after **24 hours**. Refresh by calling `/auth/login` again.

---

## Endpoints

### Create User

Create a new user account.

```
POST /users
```

**Headers**

| Header          | Value                   | Required |
|-----------------|-------------------------|----------|
| `Authorization` | `Bearer <access_token>` | ✅ Yes   |
| `Content-Type`  | `application/json`      | ✅ Yes   |

**Request Body**

| Field       | Type     | Required | Description                        |
|-------------|----------|----------|------------------------------------|
| `name`      | `string` | ✅ Yes   | Full name of the user              |
| `email`     | `string` | ✅ Yes   | Valid email address                |
| `password`  | `string` | ✅ Yes   | Minimum 8 characters               |
| `role`      | `string` | ❌ No    | `admin` or `user` (default: `user`)|
| `avatar_url`| `string` | ❌ No    | URL to profile image               |

**Example Request**

```json
POST /users HTTP/1.1
Host: api.myapp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecureP@ss123",
  "role": "admin",
  "avatar_url": "https://example.com/avatar.png"
}
```

**Example Response** — `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "usr_abc123",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin",
    "avatar_url": "https://example.com/avatar.png",
    "created_at": "2026-03-25T10:30:00Z"
  }
}
```

**Error Response** — `422 Unprocessable Entity`

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Email already exists" },
    { "field": "password", "message": "Must be at least 8 characters" }
  ]
}
```

---

### Login

Authenticate and receive an access token. **No authentication required.**

```
POST /auth/login
```

**Headers**

| Header         | Value              | Required |
|----------------|--------------------|----------|
| `Content-Type` | `application/json` | ✅ Yes   |

**Request Body**

| Field      | Type     | Required | Description       |
|------------|----------|----------|-------------------|
| `email`    | `string` | ✅ Yes   | Registered email  |
| `password` | `string` | ✅ Yes   | Account password  |

**Example Request**

```json
POST /auth/login HTTP/1.1
Host: api.myapp.com
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "SecureP@ss123"
}
```

**Example Response** — `200 OK`

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfYWJjMTIzIiwiaWF0IjoxNzExMzU2MjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "usr_abc123",
      "name": "Jane Doe",
      "role": "admin"
    }
  }
}
```

**Error Response** — `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

---

### Create Order

Submit a new order with line items.

```
POST /orders
```

**Headers**

| Header          | Value                   | Required |
|-----------------|-------------------------|----------|
| `Authorization` | `Bearer <access_token>` | ✅ Yes   |
| `Content-Type`  | `application/json`      | ✅ Yes   |

**Request Body**

| Field             | Type       | Required | Description                          |
|-------------------|------------|----------|--------------------------------------|
| `customer_id`     | `string`   | ✅ Yes   | ID of the customer                   |
| `items`           | `array`    | ✅ Yes   | Array of order items (see below)     |
| `items[].product_id` | `string`| ✅ Yes   | Product ID                           |
| `items[].quantity`| `integer`  | ✅ Yes   | Quantity (min: 1)                    |
| `items[].price`   | `number`   | ✅ Yes   | Unit price in USD                    |
| `shipping_address`| `object`   | ✅ Yes   | Shipping address object (see below)  |
| `shipping_address.street` | `string` | ✅ Yes | Street address                 |
| `shipping_address.city`   | `string` | ✅ Yes | City                           |
| `shipping_address.state`  | `string` | ✅ Yes | State / Province               |
| `shipping_address.zip`    | `string` | ✅ Yes | ZIP / Postal code              |
| `shipping_address.country`| `string` | ✅ Yes | ISO 3166‑1 alpha‑2 code       |
| `note`            | `string`   | ❌ No    | Optional order note                  |

**Example Request**

```json
POST /orders HTTP/1.1
Host: api.myapp.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "customer_id": "cus_xyz789",
  "items": [
    {
      "product_id": "prod_001",
      "quantity": 2,
      "price": 29.99
    },
    {
      "product_id": "prod_042",
      "quantity": 1,
      "price": 14.50
    }
  ],
  "shipping_address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94105",
    "country": "US"
  },
  "note": "Leave at the front door"
}
```

**Example Response** — `201 Created`

```json
{
  "status": "success",
  "data": {
    "id": "ord_20260325_001",
    "customer_id": "cus_xyz789",
    "items": [
      { "product_id": "prod_001", "quantity": 2, "price": 29.99, "subtotal": 59.98 },
      { "product_id": "prod_042", "quantity": 1, "price": 14.50, "subtotal": 14.50 }
    ],
    "total": 74.48,
    "currency": "USD",
    "status": "pending",
    "created_at": "2026-03-25T14:00:00Z"
  }
}
```

---

## Error Codes

| HTTP Code | Status                 | Description                                  |
|-----------|------------------------|----------------------------------------------|
| `200`     | OK                     | Request succeeded                            |
| `201`     | Created                | Resource created successfully                |
| `400`     | Bad Request            | Malformed request body or parameters         |
| `401`     | Unauthorized           | Missing or invalid authentication token      |
| `403`     | Forbidden              | Insufficient permissions                     |
| `404`     | Not Found              | Resource does not exist                      |
| `422`     | Unprocessable Entity   | Validation errors in request body            |
| `429`     | Too Many Requests      | Rate limit exceeded (100 req/min)            |
| `500`     | Internal Server Error  | Unexpected server error                      |

---

## Playground

Try the API directly from your terminal. Copy and paste the commands below.

### 1️⃣ Login — Get Your Token

```bash
curl -X POST https://api.myapp.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecureP@ss123"
  }'
```

### 2️⃣ Create a User

```bash
curl -X POST https://api.myapp.com/v1/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PASTE_YOUR_TOKEN_HERE>" \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "password": "MyStr0ngP@ss"
  }'
```

### 3️⃣ Create an Order

```bash
curl -X POST https://api.myapp.com/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <PASTE_YOUR_TOKEN_HERE>" \
  -d '{
    "customer_id": "cus_xyz789",
    "items": [
      { "product_id": "prod_001", "quantity": 2, "price": 29.99 }
    ],
    "shipping_address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zip": "94105",
      "country": "US"
    }
  }'
```

### 🌐 Interactive Playground

For a full interactive experience, import the collection into your favorite API client:

| Tool | Link |
|------|------|
| **Swagger UI** | [Open Swagger UI](https://petstore.swagger.io/?url=https://api.myapp.com/v1/openapi.json) |
| **Postman** | [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/your-collection-id) |
| **Hoppscotch** | [Open in Hoppscotch](https://hoppscotch.io) |

> 💡 **Tip:** You can also paste any `curl` command above into [httpie.io/app](https://httpie.io/app) for a visual request builder.

---

<details>
<summary><strong>📋 Quick Reference — All Endpoints</strong></summary>

| Method | Endpoint        | Auth Required | Description           |
|--------|-----------------|---------------|-----------------------|
| `POST` | `/auth/login`   | ❌ No         | Login & get token     |
| `POST` | `/users`        | ✅ Yes        | Create a new user     |
| `POST` | `/orders`       | ✅ Yes        | Create a new order    |

</details>

---

<p align="center">
  Made with ❤️ by <strong>MyApp Team</strong> &nbsp;|&nbsp;
  <a href="https://github.com/myapp">GitHub</a> &nbsp;|&nbsp;
  <a href="mailto:support@myapp.com">Support</a>
</p>
