// ------------------------------- STEP 1:
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

//------------------------------- STEP 2:
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const pool = require("./config/db");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // TEST DATABASE ROUTE
// app.get("/test-db", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     console.log("DB PASSWORD:", process.env.DB_PASSWORD);
//     res.status(500).send("Database connection failed");
//   }
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// ---------------------------- STEP 3:
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

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

// 👇 ADD THIS ROUTE
// app.get("/api/users", async (req, res) => {
//   try {
//     const result = await pool.query(
//       "SELECT id, full_name, email, created_at FROM users ORDER BY id"
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching users");
//   }
// });
const userRoutes = require("./routes/userRoutes");

app.use("/api/users", userRoutes);


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


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
