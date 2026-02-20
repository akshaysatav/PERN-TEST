OVERVIEW OF WHAT WE ARE BUILDING
PostgreSQL → Node/Express API → React → Browser
We will create:
Database table: users
Backend API: /api/users
Frontend page: Shows users list

🟢 STEP 1 — Create Backend Project

📌 Task 1.1 — Create Backend Folder
Open terminal:
mkdir pern-test
cd pern-test
mkdir backend
cd backend
npm init -y

📌 Task 1.2 — Install Required Packages
npm install express pg cors dotenv
npm install nodemon --save-dev

What these are:
| Package | Purpose                   |
| ------- | ------------------------- |
| express | Server                    |
| pg      | PostgreSQL connection     |
| cors    | Allow frontend connection |
| dotenv  | Environment variables     |
| nodemon | Auto restart server       |

📌 Task 1.3 — Update package.json
Open package.json and add:
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}

📌 Task 1.4 — Create Basic Server
Create file:
backend/server.js

Add:
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


📌 Task 1.5 — Run Server
npm run dev

Open browser:
http://localhost:5000

If you see:
Backend is running 🚀
✅ Backend is working.

🔵 STEP 2 — Connect PostgreSQL to Backend
We will:
1. Create .env file
2. Add DB connection details
3. Create DB connection file
4. Test DB connection

🟢 Task 2.1 — Create .env File
Inside:
backend/

Create a file:
.env

Add your PostgreSQL details:
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=demo

⚠️ Replace:
your_password → your PostgreSQL password
demo → your database name (you said you created demo DB)

🟢 Task 2.2 — Create Database Connection File
Inside backend/ create a new folder:
config

Inside it create file:
config/db.js

Add this code:
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = pool;

🟢 Task 2.3 — Test Database Connection
Now open:
server.js

Modify it like this:
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// TEST DATABASE ROUTE
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

🟢 Task 2.4 — Restart Server
Stop server (Ctrl + C)
npm run dev

🟢 Task 2.5 — Test Database
Open browser:
http://localhost:5000/test-db

If everything is correct, you should see something like:
{
  "now": "2026-02-17T10:45:00.000Z"
}

That means:
✅ PostgreSQL connected
✅ Node connected
✅ Express working

🟣 STEP 3 — Create users Table + API Route
We will now:
1. Create users table in PostgreSQL
2. Insert sample data
3. Create API route /api/users
4. Test in browser

🟢 Task 3.1 — Create Users Table
Open your PostgreSQL SQL editor and run:

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

🟢 Task 3.2 — Insert 3 Users
INSERT INTO users (full_name, email, password)
VALUES
('Akshay Satav', 'akshay@example.com', '123456'),
('Rahul Sharma', 'rahul@example.com', '123456'),
('Swaranjali Rasker', 'swara@example.com', '123456');

🟢 Task 3.3 — Create API Route to Get Users
Open: server.js

Add this below /test-db route:
// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name, email, created_at FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

🟢 Task 3.4 — Restart Server
npm run dev


🟢 Task 3.5 — Test API
Open browser:
http://localhost:5000/api/users

You should see:
[
  {
    "id": 1,
    "full_name": "Akshay Satav",
    "email": "akshay@example.com",
    "created_at": "..."
  }
]

Note: 👉 Add the API route inside server.js. In real projects we separate routes into folders, but for learning we keep it simple.

🟢 Add This BELOW /test-db Route
// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

Now your backend is fully working:

✅ PostgreSQL
✅ Express
✅ API route
✅ Data returning

Now we move to frontend 👇

🟡 STEP 4 — Setup React Frontend

We will:
1. Create React app
2. Connect to backend
3. Fetch users
4. Display in browser

🟢 Task 4.1 — Create React App
Go back to root folder:
cd ..

Now you are in:
pern-test/

Now run:
npx create-react-app frontend

Wait until installation completes.

Then go inside: cd frontend

Start React: npm start

Browser should open: http://localhost:3000

If React default page shows → ✅ Frontend working.

🔵 STEP 5 — Connect React to Backend

🟢 Task 5.1 — Clean App.js
Go to: frontend/src/App.js

Replace everything inside with this:
import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Users List</h1>

      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.full_name} — {user.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;

🟢 Task 5.2 — Save & Check Browser

Your React server should already be running on: http://localhost:3000


✅ Expected Result
Browser should show:
Users List
Akshay Satav — akshay@example.com
Rahul Sharma — rahul@example.com
Swaranjali Rasker — swara@example.com

🟣 STEP 6 — Add New User From Frontend

We will now:
1. Create POST API in backend
2. Add form in React
3. Submit user
4. Insert into PostgreSQL
5. Show updated lis

🟢 Task 6.1 — Add POST Route in Backend
Open:
backend/server.js

Add below /api/users route:
// CREATE NEW USER
app.post("/api/users", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [full_name, email, password]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

Restart backend: npm run dev

🟢 Task 6.2 — Update React App.js

Replace your current App.js with this:

import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const fetchUsers = () => {
    fetch("http://localhost:5000/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ full_name: "", email: "", password: "" });
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PERN Stack Users</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button type="submit">Add User</button>
      </form>

      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.full_name} — {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


🟢 Now Test
Fill form
Click Add User
New user should appear instantly
Check PostgreSQL → row added


