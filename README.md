# 🚀 Project Management Backend API

A complete Project Management Backend built using **Node.js**, **Express.js**, and **MongoDB**.

This project provides REST APIs for authentication, project management, project members, tasks, and subtasks with JWT authentication and role-based authorization.

---

# ✨ Features

## 👤 Authentication

- User Registration
- User Login
- User Logout
- Refresh Access Token
- Change Password
- Forgot Password
- Reset Password
- Get Current User

---

## 📁 Project Management

- Create Project
- Get All Projects
- Get Project By ID
- Update Project
- Delete Project

---

## 👥 Project Members

- Add Member
- Update Member Role
- Remove Member
- Get All Members

---

## ✅ Task Management

- Create Task
- Get All Tasks
- Get Task By ID
- Update Task
- Delete Task

---

## ✅ SubTask Management

- Create SubTask
- Update SubTask
- Delete SubTask

---

## 🔐 Security

- JWT Authentication
- Access Token
- Refresh Token
- Password Hashing using bcrypt
- Role Based Authorization
- Protected Routes

---

## 📂 File Upload

- Upload Task Attachments
- Multer Integration

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB Atlas
- Mongoose

### Authentication

- JWT
- bcrypt

### Validation

- Express Validator

### File Upload

- Multer

### Utilities

- Cookie Parser
- CORS
- dotenv

---

# 📁 Project Structure

```
src
│
├── controllers
├── models
├── routes
├── middlewares
├── validators
├── db
├── utils
│
├── app.js
└── index.js
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/omk-collab/projectmanagement-backend.git
```

Go inside project

```bash
cd projectmanagement-backend
```

Install Dependencies

```bash
npm install
```

Create .env file

```env
PORT=9000

MONGO_URI=YOUR_MONGODB_URI

ACCESS_TOKEN_SECRET=YOUR_ACCESS_SECRET

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=YOUR_REFRESH_SECRET

REFRESH_TOKEN_EXPIRY=10d

CORS_ORIGIN=http://localhost:5173

SERVER_URL=http://localhost:9000
```

Run Server

```bash
npm run dev
```

Server

```
http://localhost:9000
```

---

# 📌 API Base URL

```
http://localhost:9000/api/v1
```

---

# 📡 Available APIs

## Authentication

```
POST    /auth/register

POST    /auth/login

POST    /auth/logout

POST    /auth/refresh-token

POST    /auth/change-password

POST    /auth/forgot-password

POST    /auth/reset-password

GET     /auth/current-user
```

---

## Projects

```
POST    /projects

GET     /projects

GET     /projects/:projectId

PUT     /projects/:projectId

DELETE  /projects/:projectId
```

---

## Project Members

```
POST    /projects/:projectId/members

GET     /projects/:projectId/members

PUT     /projects/:projectId/members/:memberId

DELETE  /projects/:projectId/members/:memberId
```

---

## Tasks

```
POST    /tasks/:projectId

GET     /tasks/:projectId

GET     /tasks/:projectId/t/:taskId

PUT     /tasks/:projectId/t/:taskId

DELETE  /tasks/:projectId/t/:taskId
```

---

## SubTasks

```
POST    /tasks/:projectId/t/:taskId/subtasks

PUT     /tasks/:projectId/st/:subTaskId

DELETE  /tasks/:projectId/st/:subTaskId
```

---

# 🔑 Authentication

All protected APIs require:

```
Authorization: Bearer <ACCESS_TOKEN>
```

---

# 📷 API Testing

All APIs were tested using:

- Postman

---

# 📦 Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- multer
- express-validator
- cookie-parser
- cors
- dotenv
- nodemon

---

# 📈 Future Improvements

- Notifications
- Comments on Tasks
- Due Dates
- Task Priority
- Search API
- Pagination
- Dashboard Analytics
- Activity Logs
- Email Notifications

---

# 👨‍💻 Author

**Om**

Second Year Engineering Student

Passionate about Backend Development and Full Stack Web Development.

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

---

# 📄 License

This project is for learning and educational purposes.