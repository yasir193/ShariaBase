import { pool } from "../../../DB/connection.js";
// Add User
export const addUser = async (req, res) => {
  try {
    const {
      name,
      email,
      job_title,
      typeOfUser,
      business_name,
      business_sector,
      password,
      phone,
    } = req.body;

    const emailCheck = await pool.query(
      "SELECT 1 FROM tbl_users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const query = `
      INSERT INTO tbl_users 
        (name, email, job_title, typeOfUser, business_name, business_sector, password, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING user_id, name, email
    `;
    const values = [
      name,
      email,
      job_title,
      typeOfUser,
      business_name,
      business_sector,
      password,
      phone,
    ];
    const result = await pool.query(query, values);

    res.json({
      message: "User added successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.typeOfUser,
        u.job_title,
        u.business_name,
        u.business_sector,
        u.phone,
        p.plan_id,
        p.plan_name,
        p.daily_requests_per_day,
        p.refine_requests,
        p.number_of_uploads
      FROM tbl_users u
      INNER JOIN tbl_plans p
      ON u.fk_plan_id = p.plan_id
      ORDER BY u.user_id ASC;
    `;
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      res.json({ message: "no users found" });
    }
    res.json({ data: result.rows });
  } catch (error) {
    res.json({ error: error.message });
  }
};
export const getUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        u.user_id,
        u.name,
        u.email,
        u.typeOfUser,
        p.plan_id,
        p.plan_name,
        p.daily_requests_per_day,
        p.refine_requests,
        p.number_of_uploads
      FROM tbl_users u
      inner JOIN tbl_plans p
      ON u.fk_plan_id = p.plan_id
      WHERE u.user_id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ error: "No fields provided to update" });
    }

    const setClauses = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      setClauses.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }

    values.push(id);

    const query = `
      UPDATE tbl_users
      SET ${setClauses.join(", ")}
      WHERE user_id = $${idx}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM tbl_users WHERE user_id = $1",
      [id]
    );

    result.rowCount === 0
      ? res.status(404).json({ message: `User with ID ${id} not found` })
      : res.json({
          message: "User deleted successfully",
        });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
