const pool = require("../config/db");

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, full_name, email, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
};

exports.createUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password) VALUES ($1,$2,$3) RETURNING *",
      [full_name, email, password]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
};
