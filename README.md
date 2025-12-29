# 💼 InternHill Job Board

InternHillJob-Board is a comprehensive job board application built with the MERN stack (MongoDB, Express, React, Node.js). It provides a seamless platform for job seekers to discover internship opportunities and employers to post jobs, manage applications, and track candidates. The application features role-based access control, real-time job search, and secure resume management.


## ✨ Features

- 🔐 **Role-Based Authentication** — Secure login system with JobSeeker, Employer, and Admin roles
- 🔍 **Job Listings & Search** — Advanced job search with filters, sorting, and pagination
- 📄 **Resume Management** — Secure resume upload and download using AWS S3
- 📬 **Job Applications** — Seamless application process with tracking for both seekers and employers
- 👤 **User Profiles** — Customizable profiles with work history and preferences
- 📊 **Employer Dashboard** — Manage job postings, view applications, and track candidates
- 🎯 **JobSeeker Dashboard** — Track applied jobs, saved listings, and application status
- 📱 **Responsive Design** — Mobile-friendly interface using Tailwind CSS

---

## 🛠️ Technology Stack

### 🎨 Frontend
- ⚛️ **React** (v18.2.0) — UI library
- 🛣️ **React Router DOM** (v6.20.0) — Client-side routing
- ⚡ **Vite** (v5.0.0) — Fast build tool and dev server
- 🎯 **Tailwind CSS** (v3.3.0) — Utility-first CSS framework
- 🎨 **Lucide React** (v0.555.0) — Icon library
- 🎭 **PostCSS** — CSS processing

### 🖥️ Backend
- 🟢 **Node.js** — JavaScript runtime
- 🚀 **Express.js** (v4.18.2) — Web server framework
- 🍃 **MongoDB** (Mongoose v7.0.4) — NoSQL database
- ☁️ **AWS SDK** (v2.1400.0) — AWS S3 integration for file storage
- 🔑 **JWT (jsonwebtoken v9.0.0)** — Secure authentication tokens
- 🔒 **Bcryptjs** (v2.4.3) — Password hashing
- 📤 **Multer** (v1.4.5) & **Multer-S3** (v2.10.0) — File upload middleware
- 🛡️ **Helmet** (v7.2.0) — Security headers
- ✅ **Express Validator** (v7.0.1) — Input validation
- ⏱️ **Express Rate Limit** (v6.7.0) — Rate limiting
- 📝 **Morgan** (v1.10.0) — Request logging
- 📊 **Winston** (v3.8.2) — Application logging
- 🔀 **CORS** (v2.8.5) — Cross-origin resource sharing
- 🔧 **Dotenv** (v17.2.3) — Environment variables

---

## 🚀 Installation & Setup

### 📋 Prerequisites
Ensure you have the following installed:
- 🟢 **Node.js** (v14 or higher)
- 📦 **npm** or **yarn** package manager
- 🍃 **MongoDB** (local or cloud instance)
- ☁️ **AWS S3** account (for file uploads)

### ⚡ Quick Start

#### 1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd Internhill_Internship_Job-Board
```

#### 2️⃣ Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
PORT=5000
```

Start the server:
```bash
npm start
```

#### 3️⃣ Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the development server:
```bash
npm run dev
```

#### 4️⃣ Access the Application
- 🌐 Open your browser and navigate to `http://localhost:5173`
- ✨ Create an account or login with existing credentials

---

## 📁 Project Structure

```
Internhill_Internship_Job-Board/
├── server/                 # Node.js/Express backend
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & file upload
│   ├── utils/             # Helper functions (AWS S3)
│   └── server.js          # Entry point
│
├── client/                # React/Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── main.jsx       # Entry point
│   └── package.json
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests with improvements.

---

## 📜 License

This project is open source and available under the MIT License.

---

## 💬 Support

For questions or issues, please open an issue on the repository or contact the development team.

