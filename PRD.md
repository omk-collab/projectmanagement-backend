# Product Requirements Document (PRD)

# Project Name

Project Management System

---

# Objective

The objective of this project is to build a secure and scalable Project Management Backend API that allows teams to manage projects, tasks, and subtasks efficiently.

The application provides authentication, role-based authorization, project management, task tracking, and file attachment support.

---

# Problem Statement

Managing projects manually becomes difficult as the team size increases.

There should be a centralized backend where:

- Users can create projects
- Admins can manage members
- Tasks can be assigned
- Progress can be tracked
- Attachments can be uploaded
- Authentication is secure

---

# Target Users

- Students
- Developers
- Small Teams
- Startups
- Organizations

---

# Functional Requirements

## Authentication

- Register User
- Login User
- Logout
- Refresh Token
- Forgot Password
- Reset Password
- Change Password

---

## Project Module

- Create Project
- Update Project
- Delete Project
- View Projects

---

## Member Module

- Add Member
- Remove Member
- Update Member Role

---

## Task Module

- Create Task
- Update Task
- Delete Task
- View Tasks

---

## SubTask Module

- Create SubTask
- Update SubTask
- Delete SubTask

---

## Attachment Module

- Upload Files
- Store Attachment Metadata

---

# Non Functional Requirements

- Secure Authentication
- Fast API Response
- MongoDB Database
- RESTful API Design
- Scalable Architecture

---

# Technology Stack

Backend

- Node.js
- Express.js

Database

- MongoDB
- Mongoose

Authentication

- JWT
- bcrypt

Validation

- Express Validator

File Upload

- Multer

---

# API Architecture

Client

↓

Express Server

↓

Authentication Middleware

↓

Controllers

↓

MongoDB

---

# Future Enhancements

- Comments
- Due Dates
- Priority
- Notifications
- Dashboard
- Analytics
- Activity Logs
- Email Notifications
- Search
- Pagination

---

# Project Status

Backend Development Completed


---

# Author

Om Khairnar

Sinhgad College of Engineering

Backend Developer