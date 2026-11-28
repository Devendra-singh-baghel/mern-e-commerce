# API Specification

This document details all REST API endpoints available in the NexCart backend, including authentication requirements, accepted parameters, and response structures.

---

## General Conventions

- **Base URL**: `/api/v1` (with the exception of `/health`, which is mounted at the root)
- **Content Type**: `application/json` (except for endpoints with image uploads, which use `multipart/form-data`)
- **Authentication**: JWT tokens passed automatically via `httpOnly` cookies (`accessToken`) or via the `Authorization: Bearer <token>` request header.

### Common Success Response Structure
```json
{
  "success": true,
  "message": "Optional descriptive status message",
  "dataField": {}
}
```

### Common Error Response Structure
Standardized via `backend/middlewares/error.js`:
```json
{
  "success": false,
  "message": "Detailed error message or validation summary",
  "errors": [],
  "stack": "Stack trace string (included only when NODE_ENV === 'development')"
}
```

---

## System & Health Endpoints

### Liveness Probe (`GET /health`)

Lightweight health check endpoint mounted directly at the application root (`/health`, NOT under `/api/v1`). It is registered before CORS, body parsers, cookie parsers, and authentication middlewares, and makes no database queries. Primarily used as a liveness probe and keep-alive target by external monitoring cron jobs (such as `cron-job.org`) to mitigate free-tier instance idling.

| Method | Endpoint | Auth Required | Role | Response Headers | Description |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `GET` | `/health` | No | Any | `Cache-Control: no-store` | Returns server status, process uptime in seconds, and UTC timestamp. |

#### Sample 200 Response:
```json
{
  "status": "ok",
  "uptime": 120,
  "timestamp": "2026-11-27T06:05:42.551Z"
}
```

---

## Endpoints by Resource

### 1. Authentication & User Management

Routes defined in `backend/routes/user.routes.js`.

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/v1/register` | No | Any | Register a new user account with avatar image. |
| `POST` | `/api/v1/login` | No | Any | Authenticate user credentials and receive JWT cookies. |
| `POST` | `/api/v1/logout` | Yes | Any | Clear user session, delete refresh token, and unset cookies. |
| `POST` | `/api/v1/password/forgot` | No | Any | Generate password reset token and dispatch email link. |
| `POST` | `/api/v1/password/reset/:token` | No | Any | Reset password using valid SHA-256 token from email. |
| `GET` | `/api/v1/profile` | Yes | Any | Retrieve profile data of currently authenticated user. |
| `PATCH` | `/api/v1/profile/update` | Yes | Any | Update authenticated user's name, email, or avatar. |
| `PUT` | `/api/v1/password/update` | Yes | Any | Change password by verifying current password. |
| `GET` | `/api/v1/admin/users` | Yes | `admin` | List all registered users (excluding sensitive tokens). |
| `GET` | `/api/v1/admin/user/:id` | Yes | `admin` | Retrieve details of a specific user by ID. |
| `PATCH` | `/api/v1/admin/user/:id` | Yes | `admin` | Update role (`user` or `admin`) for a specified user. |
| `DELETE` | `/api/v1/admin/user/:id` | Yes | `admin` | Delete a user account and remove their Cloudinary avatar. |

---

### 2. Products & Reviews

Routes defined in `backend/routes/product.routes.js`.

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `GET` | `/api/v1/products` | No | Any | Retrieve paginated catalog with keyword search, filter, and sort. |
| `GET` | `/api/v1/product/:id` | No | Any | Retrieve full details of a single product. |
| `POST` | `/api/v1/product/review` | Yes | Any | Submit or update a product review and recalculate avg rating. |
| `GET` | `/api/v1/admin/products` | Yes | `admin` | Retrieve complete list of products for admin management. |
| `POST` | `/api/v1/admin/product/create` | Yes | `admin` | Create a new product with image uploads to Cloudinary. |
| `PATCH` | `/api/v1/admin/product/:id` | Yes | `admin` | Update product details and replace Cloudinary images. |
| `DELETE` | `/api/v1/admin/product/:id` | Yes | `admin` | Delete product and purge its images from Cloudinary. |
| `GET` | `/api/v1/admin/reviews/:productId` | Yes | `admin` | View all reviews and ratings submitted for a product. |
| `DELETE` | `/api/v1/admin/review/:productId/:reviewId` | Yes | `admin` | Remove a review and recalculate product's average rating. |

#### Query Parameters for `GET /api/v1/products`
- `keyword` (string): Case-insensitive partial name search (regex-escaped).
- `category` (string): Exact category match filter.
- `page` (number): Page number (defaults to `1`).
- `limit` (number): Items per page (defaults to `10`).
- `sort` (string): Field to sort by (`price`, `name`, `createdAt`, `ratings`).
- `order` (string): Sorting order (`asc` or `desc`).

---

### 3. Shopping Cart

> [!NOTE]
> Shopping cart persistence and item calculations are managed on the client side using Redux Toolkit and `localStorage` (`cartSlice.js`). When adding items to cart, the client requests `GET /api/v1/product/:id` to obtain current product availability and pricing snapshot.

---

### 4. Orders Management

Routes defined in `backend/routes/order.routes.js`.

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/v1/new/order` | Yes | Any | Validate stock, compute prices server-side, create order, deduct stock. |
| `GET` | `/api/v1/order/:id` | Yes | Any* | Retrieve single order details (*must be order owner or admin). |
| `GET` | `/api/v1/orders/me` | Yes | Any | Retrieve list of orders placed by authenticated user. |
| `PATCH` | `/api/v1/order/:id` | Yes | Any | Cancel an active order and restore items back into stock. |
| `GET` | `/api/v1/admin/orders` | Yes | `admin` | Retrieve all platform orders and aggregated total revenue. |
| `PATCH` | `/api/v1/admin/order/:id` | Yes | `admin` | Update fulfillment status (`Shipped` or `Delivered`). |
| `DELETE` | `/api/v1/admin/order/:id` | Yes | `admin` | Delete order record (allowed only for `Delivered` orders). |

---

### 5. Payments (Razorpay)

Routes defined in `backend/routes/payment.routes.js`.

| Method | Endpoint | Auth Required | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| `POST` | `/api/v1/payment/process` | Yes | Any | Create a Razorpay checkout order with amount converted to paise. |
| `GET` | `/api/v1/getKey` | Yes | Any | Provide client with public `RAZORPAY_API_KEY`. |
| `POST` | `/api/v1/paymentVerification` | No | Any | Verify Razorpay HMAC-SHA256 signature against webhook/client payload. |

---

## Detailed Request & Response Examples

### 1. Register User (`POST /api/v1/register`)
- **Headers**: `Content-Type: multipart/form-data`
- **Body**:
  - `name`: `John Doe`
  - `email`: `john@example.com`
  - `password`: `secretPass123`
  - `avatar`: `<binary_image_file>`

#### Sample 201 Response:
```json
{
  "success": true,
  "message": "User Registered Successfully.",
  "user": {
    "_id": "6740ad2f1e2f89c091f0a123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": {
      "public_id": "avatars/sample_public_id",
      "url": "https://res.cloudinary.com/nexcart/image/upload/v12345/avatars/sample.jpg"
    },
    "role": "user",
    "createdAt": "2026-11-20T10:00:00.000Z",
    "updatedAt": "2026-11-20T10:00:00.000Z"
  }
}
```

---

### 2. Login User (`POST /api/v1/login`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "secretPass123"
}
```

#### Sample 200 Response:
```json
{
  "success": true,
  "message": "User Logged in Successfully.",
  "user": {
    "_id": "6740ad2f1e2f89c091f0a123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": {
      "public_id": "avatars/sample_public_id",
      "url": "https://res.cloudinary.com/nexcart/image/upload/v12345/avatars/sample.jpg"
    },
    "role": "user",
    "createdAt": "2026-11-20T10:00:00.000Z",
    "updatedAt": "2026-11-20T10:00:00.000Z"
  }
}
```

---

### 3. Get All Products (`GET /api/v1/products`)
- **Query**: `?page=1&limit=10&keyword=shoes&category=Footwear&sort=price&order=asc`

#### Sample 200 Response:
```json
{
  "success": true,
  "products": [
    {
      "_id": "6740b10f1e2f89c091f0a456",
      "name": "Road Runner Shoes",
      "description": "Ergonomic running shoes with cushioned soles.",
      "price": 2499,
      "image": [
        {
          "public_id": "products/prod_123",
          "url": "https://res.cloudinary.com/nexcart/image/upload/v12345/products/prod_123.jpg"
        }
      ],
      "category": "Footwear",
      "stock": 15,
      "numOfReviews": 1,
      "avgRatings": 5,
      "reviews": [
        {
          "_id": "6740b15f1e2f89c091f0a789",
          "user": "6740ad2f1e2f89c091f0a123",
          "name": "John Doe",
          "rating": 5,
          "comment": "Exceptional comfort and quality."
        }
      ],
      "createdBy": "6740aa1f1e2f89c091f0a001",
      "createdAt": "2026-11-21T08:30:00.000Z",
      "updatedAt": "2026-11-21T08:30:00.000Z"
    }
  ],
  "productCount": 1,
  "resultsPerPage": 10,
  "totalPages": 1,
  "currentPage": 1
}
```

---

### 4. Create New Order (`POST /api/v1/new/order`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "shippingInfo": {
    "address": "452 Elm Street, Flat 3B",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "pinCode": 400001,
    "phoneNumber": 9876543210
  },
  "orderItems": [
    {
      "name": "Road Runner Shoes",
      "price": 2499,
      "quantity": 1,
      "image": "https://res.cloudinary.com/nexcart/image/upload/v12345/products/prod_123.jpg",
      "product": "6740b10f1e2f89c091f0a456"
    }
  ],
  "paymentMethod": "Online",
  "paymentInfo": {
    "id": "pay_Pq12345678",
    "status": "completed"
  }
}
```

#### Sample 201 Response:
```json
{
  "success": true,
  "message": "Order Created Successfully.",
  "order": {
    "_id": "6740b80f1e2f89c091f0a999",
    "shippingInfo": {
      "address": "452 Elm Street, Flat 3B",
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India",
      "pinCode": 400001,
      "phoneNumber": 9876543210
    },
    "orderItems": [
      {
        "_id": "6740b80f1e2f89c091f0a998",
        "name": "Road Runner Shoes",
        "price": 2499,
        "quantity": 1,
        "image": "https://res.cloudinary.com/nexcart/image/upload/v12345/products/prod_123.jpg",
        "product": "6740b10f1e2f89c091f0a456"
      }
    ],
    "user": "6740ad2f1e2f89c091f0a123",
    "paymentInfo": {
      "id": "pay_Pq12345678",
      "status": "completed"
    },
    "paymentMethod": "Online",
    "paidAt": "2026-11-22T14:15:00.000Z",
    "itemsPrice": 2499,
    "taxPrice": 449.82,
    "shippingPrice": 0,
    "totalPrice": 2948.82,
    "orderStatus": "Processing",
    "createdAt": "2026-11-22T14:15:00.000Z",
    "updatedAt": "2026-11-22T14:15:00.000Z"
  }
}
```

---

### 5. Verify Razorpay Payment (`POST /api/v1/paymentVerification`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "razorpay_payment_id": "pay_Pq12345678",
  "razorpay_order_id": "order_Ok87654321",
  "razorpay_signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

#### Sample 200 Response (Success):
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "reference": "pay_Pq12345678"
}
```

#### Sample 200 Response (Verification Failed):
```json
{
  "success": false,
  "message": "Payment verification failed"
}
```
