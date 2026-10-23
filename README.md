# Take It Easy — Streetwear E-commerce Website

**Wear what feels like you.**

Take It Easy is a modern streetwear e-commerce platform built to deliver a smooth, responsive, and user-friendly online shopping experience. Customers can explore trendy oversized T-shirts, view product details, add items to their cart, place orders, and choose from multiple payment methods.

🌐 **Live Website:** https://takeiteasybd.vercel.app/

---

## ✨ Features

- 🛍️ Modern and responsive e-commerce interface
- 👕 Streetwear and oversized T-shirt collections
- 🔎 Product browsing and detailed product views
- 🖼️ Product image gallery and thumbnails
- 🛒 Shopping cart with quantity management
- 📦 Order placement and order tracking
- 👤 User authentication and account management
- 💳 Cash on Delivery (COD), bKash, Nagad, and Rocket payment options
- 🧾 Payment screenshot upload for supported mobile payment methods
- 📱 Mobile-friendly navigation and responsive layouts
- 🎨 Clean UI with a modern streetwear aesthetic
- 🔐 Admin dashboard for managing store operations
- 📢 Promotional banners and product offers
- 🚀 Deployed on Vercel

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

**Deployment & Services**
- Vercel
- ImgBB for payment image uploads
- Telegram Bot API for order notifications

## 🎨 Design

Take It Easy focuses on a clean, premium streetwear shopping experience.

- **Primary Accent:** Orange (`#F54900`)
- **Background:** White and soft neutral tones
- **Dark Color:** `#111111`
- **Typography:** Poppins, Space Grotesk, and Hind Siliguri
- **Layout:** Responsive design for mobile, tablet, and desktop

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB connection or MongoDB Atlas account
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone YOUR_REPOSITORY_URL
   ```

2. Navigate to the project directory:

   ```bash
   cd YOUR_PROJECT_FOLDER
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file and configure the required environment variables.

5. Start the development server:

   ```bash
   npm run dev
   ```

> **Note:** Frontend and backend setup commands may differ depending on the project structure. Configure the environment variables according to your application.

## 🔐 Environment Variables

Configure the required environment variables for your backend. Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:5173

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id

IMGBB_API_KEY=your_imgbb_api_key
```

Keep your `.env` file private. Never commit API keys, passwords, database credentials, or other secrets to GitHub.

## 📂 Project Structure

The project may contain separate frontend and backend directories.

```text
take-it-easy/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── assets/
│   └── package.json
│
├── server/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

*The structure above is illustrative and may differ from the actual repository.*

## 🌍 Live Demo

Explore the live website:

**https://takeiteasybd.vercel.app/**

## 🛒 About Take It Easy

Take It Easy is a streetwear brand focused on comfortable fits, modern designs, and effortless everyday style. The website is designed to make discovering and ordering streetwear products simple and convenient for customers in Bangladesh.

## 📄 License

All rights reserved by Take It Easy unless otherwise specified.

---

**Take It Easy — Wear what feels like you.**
