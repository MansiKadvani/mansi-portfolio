# B.Tech Computer Engineering Portfolio & SaaS Dashboard

A premium, full-stack, developer-focused portfolio and engineering command center styled like a cohesive modern SaaS product. Engineered with React 19, TypeScript, Tailwind CSS v4, and Node.js/Express, this application hosts a beautiful personal portfolio alongside an in-depth administrative portal ("Control Hub") to manage files, profile details, and reader inquiries in real time.

---

## 🚀 Key Features

### 1. Developer Portfolio Showcase
*   **Dynamic Sections**: Seamlessly displays biography, academic milestones, technical achievements, and an interactive skills grid.
*   **Engineering Showcase**: Highlight key development projects, including problem-solved briefs, tech stack labels, and links to source code/live previews.
*   **Smooth Motion Design**: Fully animated using `motion/react` with micro-animations and route-transition visual effects.
*   **Mobile & Desktop Optimized**: Responsive layout ensuring comfortable full-grid display on spacious laptop monitors and a compact full-width layout for handy smartphone previews.

### 2. Control Hub // Admin Workspace
*   **Secure Administration**: A bespoke, JWT-secured administration cabinet designed with modern sidebar controls and tabbed workspace menus.
*   **Real-time Profile Manager**: Tailor the hero headers, scrolling animated titles, social links, metrics, and timeline events dynamically from the browser.
*   **Contact Inbox Manager**: View user inquiries and messages from the contact form as they land, with a **Direct Delete** mechanism to prune processed or spam emails cleanly.
*   **Live DB Sync Feedback Indicator**: Intelligent state machine signaling whether the cluster is connected to a primary database or running on local backup storage.

### 3. Full-Stack Architecture
*   **Server Core**: Run on an **Express** web framework integrated directly into Vite dev layers.
*   **Dual Storage Design**: Backed by **MongoDB / Mongoose** with automatic, high-availability fallback to custom single-file json arrays (in the `/data` directory) if a remote database connection is absent.
*   **Express Router Logger**: Transparent operational logs stored in `/data/express_routing.log` to audit request-response sequences.
*   **Clean Bundling**: Automated esbuild compiling for Node.js using targeted CommonJS (`dist/server.cjs`) to skip filesystem I/O overhead.

---

## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Vite, `motion/react` (Framer Motion) |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express, JSON Web Tokens (JWT) |
| **Database** | MongoDB & Mongoose (with JSON-fallback schema structures) |
| **Bundling** | ESBuild, Vite |
| **Document Export** | PDFKit (for resume generation) |

---

## 📥 Project Structure

```bash
├── data/                    # JSON assets and fallback databases
│   ├── contacts.json        # Contact message archive
│   ├── profile.json         # Master profile layout values
│   ├── projects.json        # Portfolio developer projects
│   └── skills.json          # Skills rating array
├── dist/                    # Compiled and bundled production output
├── server/                  # Backend Node.js controller & routing layers
│   ├── config/              # Database connection setups
│   ├── controllers/         # REST API controller definitions
│   ├── middlewares/         # JWT status authentication engines
│   ├── models/              # Mongoose data schemas
│   └── routes/              # Express API endpoint declarations
├── src/                     # React Single-Page Application (SPA)
│   ├── assets/              # Static vector illustrations and images
│   ├── components/          # Reusable dashboard and layout elements
│   ├── App.tsx              # Main high-level React setup
│   ├── index.css            # Entry Tailwind imports and custom fonts
│   └── main.tsx             # DOM instantiation entrypoint
├── server.ts                # Custom full-stack Express server
├── tsconfig.json            # Strict TypeScript configuration
├── package.json             # Core dependency manifest and platform scripts
└── README.md                # This project instruction index
```

---

## 🎯 Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or above recommended)
*   [npm](https://www.npmjs.com/) (bundled with Node.js)
*   *Optional*: MongoDB server instance (for real-world cluster sync)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/mansi-kadvani-portfolio.git
   cd mansi-kadvani-portfolio
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (based on `.env.example` if present), specifying credentials such as `JWT_SECRET` and `MONGO_URI`. If left empty, the application safely routes all traffic to the local `/data` fallback storage.

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

5. **Compile for Production Setup**:
   Compile both the production-ready clients and compiling the backend into a cohesive bundle:
   ```bash
   npm run build
   ```

6. **Start Production Server**:
   ```bash
   npm run start
   ```

---

## 👩‍💻 Author

**Mansi Kadvani**  
B.Tech Computer Engineering Student

*   **About**: Passionate full-stack developer dedicated to building durable, scalable web experiences, microservices, and modern user-centric interfaces.
