# Job Portal – Capstone Project

## 📋 Project Overview
A full-stack **Job Portal Application** with complete authentication, role-based access control, and CRUD operations for job postings.  
Built using the **MERN stack (MongoDB, Express.js, React, Node.js)**.

![Job Portal Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=Job+Portal+Dashboard)

---

## 🚀 Live Demo
- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:5000  
- **API Documentation:** http://localhost:5000/api-docs  

---

## ✨ Features

### ✅ Authentication & Authorization
- JWT-based authentication with secure token storage  
- Three user roles: **Admin**, **Employer**, **Job Seeker**  
- Protected routes with role-based access control  
- Secure password hashing using **bcryptjs**

---

### ✅ Complete CRUD Operations
- Create, Read, Update, Delete job postings  
- Job application system  
- Advanced filtering:
  - Location  
  - Job type  
  - Experience level  
- Pagination for job listings

---

### ✅ Role-Based Features

#### 👑 Admin
- Manage all users and job postings  
- View all job applications  
- System statistics dashboard  
- Change user roles

#### 💼 Employer
- Post new job listings  
- Manage own job postings  
- View and manage applications  
- Update job status

#### 👤 Job Seeker
- Browse job listings with filters  
- Apply for jobs  
- Track application status  
- Manage profile and resume

---

### ✅ Technical Features
- Responsive UI using **Material-UI**  
- Frontend & backend form validation  
- Centralized error handling with user-friendly messages  
- Real-time notifications using **React Hot Toast**  
- API security with **CORS** and **Helmet**  
- Cloud database using **MongoDB Atlas**

---

## 🛠️ Tech Stack

### Frontend
- React 18 (Hooks-based architecture)  
- React Router v6  
- Material-UI v5  
- React Hook Form  
- Axios  
- React Hot Toast  
- Yup (validation)

### Backend
- Node.js & Express.js  
- MongoDB Atlas  
- Mongoose ODM  
- JWT Authentication  
- bcryptjs (password hashing)  
- Express Validator  
- Helmet & CORS (security)

---

## 📂 Project Structure
```bash
job-portal-capstone/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth & role middleware
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Helpers & validators
│   │   └── server.js        # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Login & Register
│   │   │   ├── jobs/        # Job components
│   │   │   ├── layout/      # Navbar, Sidebar, Footer
│   │   │   └── common/      # Shared components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── utils/           # Helpers & validators
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── README.md
