# Personal Portfolio Website

A full-stack portfolio website built to showcase my projects, technical skills, academic journey, and software development experience. The project also includes an admin panel that allows me to manage portfolio content, profile information, and contact messages from a single dashboard.

🌐 **Live Demo:** https://mansi-portfolio-b2ol.onrender.com/

---

## 🚀 Features

### 1. Portfolio Website
*   Personal introduction and academic background
*   Skills section showcasing technologies and tools I have learned
*   Project showcase with descriptions, technologies used, and project links
*   Contact form for visitors to send messages
*   Responsive design for desktop, tablet, and mobile devices
*   Smooth animations and modern user interface

### 2. Admin Panel
*   Secure login using JWT authentication
*   Manage profile information and portfolio content
*   Update project details and skills
*   View and delete contact messages
*   Monitor database connection status
*   Simple dashboard for managing website data

### 3. Full-Stack Functionality
*   Frontend built using React and TypeScript
*   Backend developed using Node.js and Express
*   MongoDB integration using Mongoose
*   JSON-based fallback storage when database connection is unavailable
*   REST API architecture for communication between frontend and backend
*   PDF resume generation support

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Vite |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Authentication** | JSON Web Tokens (JWT) |
| **Database** | MongoDB, Mongoose |
| **Storage Backup** | JSON Files |
| **Bundling** | ESBuild, Vite |
| **Document Generation** | PDFKit |

---

## 📥 Project Structure

```bash
portfolio/
│
├── data/                    # Stores portfolio data and contact messages
│   ├── contacts.json        # Contact form submissions
│   ├── profile.json         # Personal profile information
│   ├── projects.json        # Portfolio projects data
│   └── skills.json          # Skills and technologies data
│
├── server/                  # Backend source code
│   ├── config/              # Database and application configuration
│   ├── controllers/         # Handles API request logic
│   ├── middlewares/         # Authentication and custom middleware
│   ├── models/              # MongoDB database schemas
│   └── routes/              # API route definitions
│
├── src/                     # Frontend React application
│   ├── assets/              # Images, icons, and static files
│   ├── components/          # Reusable React components
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # React application entry point
│   └── index.css            # Global styles
│
├── server.ts                # Express server entry file
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```
---

## 📥 Installation

### Prerequisites

* Node.js (v18 or later recommended)
* npm
* MongoDB (Optional)

### Clone the Repository

```bash
git clone https://github.com/your-username/mansi-portfolio.git
cd mansi-portfolio
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the root directory and add the required environment variables such as:

```env
JWT_SECRET=your_secret_key
MONGO_URI=your_mongodb_connection_string
```

If MongoDB is not configured, the application will use local JSON files stored in the `data` folder.

### Start Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

---

## 👩‍💻 About Me

**Mansi Kadvani**  
B.Tech Computer Engineering Student  
Marwadi University

I am passionate about Full Stack Development and Software Engineering. I enjoy building practical web applications, learning new technologies, and improving my problem-solving skills through real-world projects.

---

## 📬 Contact

* GitHub: https://github.com/MansiKadvani
* LinkedIn: https://www.linkedin.com/in/mansi-kadvani-583059318

---

## 📄 License

This project is licensed under the MIT License.
