<div align="center">

# 🛒 Project Node Backend

### A robust REST API built with Node.js, Express & MySQL

<br/>

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-v4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![Sequelize](https://img.shields.io/badge/Sequelize-v6-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

</div>

---

## 🔍 Overview

A scalable backend API for a product catalog and e-commerce platform. Designed with **Separation of Concerns**, it uses a Controller-Service-Model architecture to ensure maintainability and security.

---

## ✨ Features

- **🔐 Authentication**: Multi-role JWT (Admin / Customer) with Refresh Token rotation.
- **📦 Product Catalog**: Full CRUD for Products & Categories with advanced filtering (price, name, search).
- **❤️ Favorites**: Personal favorites list for users (Pagination & Search included).
- **🛒 Shopping Cart**: Persistent cart management (Add, Update, Remove).
- **🛡️ Security**: Helmet headers, bcrypt password hashing, and secure cookie storage.
- **📝 Validation**: Centralized input validation using `express-validator`.

---

## 🏗️ Architecture

- **Controllers**: Handle HTTP requests and responses.
- **Services**: Contain the core business logic.
- **Models**: Sequelize definitions for MySQL tables.
- **Middleware**: Authentication, Error handling, and Validation runner.

---

## 📁 Project Structure

```
.
├── app.js                          # Express entry point
├── config/                         # Database & Logger config
├── controllers/                    # Request handlers
├── middleware/                     # Auth & Error guards
├── models/                         # Sequelize definitions
├── routes/                         # API endpoint mounting
├── services/                       # Business logic
├── utils/                          # JWT & API helpers
└── validations/                   # express-validator rules
```

---

## 🚀 Getting Started

1. **Install dependencies**: `npm install`
2. **Setup environment**: Copy `.env.example` to `.env` and fill details.
3. **Database Sync**: Ensure `SHOULD_SYNC=true` in `.env` for the first run.
4. **Start Development**: `npm run dev`

---

## 📡 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login (Admin/User) |
| `POST` | `/api/users/register` | Register Customer |
| `GET` | `/api/products` | Browse Products (Filter & Search) |
| `GET` | `/api/favorites` | View Favorites |
| `POST` | `/api/cart` | Add to Cart |

---

<div align="center">

Made with ❤️ and Node.js

</div>