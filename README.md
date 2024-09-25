# Todo App

## Overview

The Todo App is a web application that allows users to manage their daily tasks by creating, editing, and deleting todos. Built with Express.js and Mongoose, the application uses session-based authentication for user security and bcrypt.js for password encryption. The app features a simple UI rendered with EJS templates and ensures secure access with session management.

## Live Preview:
https://todo-app-o7o7.onrender.com

## Features

- **Create, Edit, and Delete Todos**: Users can manage their todos easily.
- **Session-Based Authentication**: Secure login with sessions for persistent user sessions.
- **Password Encryption**: Passwords are securely encrypted using bcrypt.js.
- **EJS Templating**: Dynamic content rendering with EJS for a smooth user experience.

## Technologies Used

- **Express.js**: Backend framework for building the server.
- **Mongoose**: MongoDB ODM for managing the database.
- **EJS**: Templating engine for rendering dynamic pages.
- **bcrypt.js**: Password encryption for user authentication.
- **Session Management**: Used for persistent user sessions.

## Screenshots

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/Todo_App.git

2. **Install dependencies:**

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```
3. **Set up environment variables:**
Configure MongoDB connection and session secret in a .env file.

4. **Start the development server:**

   ```bash
   npm start
   ```

   or

   ```bash
   yarn start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```
## 📂 Project Structure

```plaintext
Todo_App/
├── middlewares/
│   └── isAuthMiddleware.js
├── models/
│   ├── todoModel.js
│   └── userModel.js
├── public/
│   └── browser.js
├── utils/
│   ├── authUtil.js
│   └── todoUtils.js
├── views/
│   ├── dashboardPage.ejs
│   ├── loginPage.ejs
│   └── signUpPage.ejs
├── .gitignore
├── package-lock.json
├── package.json
└── server.js
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 💬 Contact

For any inquiries, reach out via [sakshichoudhary1140@gmail.com](mailto:sakshichoudhary1140@gmail.com).

---
