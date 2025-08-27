import { pool } from "../../../DB/connection.js";
// Add Admin
export const addAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    const emailCheck = await pool.query(
      "SELECT 1 FROM tbl_admins WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const query = `
      INSERT INTO tbl_admins
        (name, email, role, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING admin_id, name, email, role, phone
    `;
    const values = [
      name,
      email,
      role,
      password,
      phone,
    ];
    const result = await pool.query(query, values);

    res.json({
      message: "Admin added successfully!",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.admin_id,
        a.name,
        a.email,
        a.phone,
        a.role
      FROM tbl_admins a
      ORDER BY a.admin_id ASC;
    `;
    const result = await pool.query(query);

    if (result.rowCount === 0) {
      res.status(404).json({ message: "no admins found" });
    }
    res.status(200).json({ data: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
export const deleteAdmin = async (req, res) => {
  try {
    const { targetId } = req.params; // admin to delete
    const requester = req.admin; // from JWT middleware

    // only super can delete
    if (requester.role !== "super") {
      return res.status(403).json({ error: "Only super admins can delete" });
    }

    // prevent super from deleting themselves
    if (parseInt(targetId) === requester.admin_id) {
      return res.status(400).json({ error: "You cannot delete yourself" });
    }

    // check target
    const target = await pool.query(
      "SELECT admin_id, role FROM tbl_admins WHERE admin_id = $1",
      [targetId]
    );

    if (target.rows.length === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (target.rows[0].role === "super") {
      return res.status(403).json({ error: "Cannot delete a super admin" });
    }

    await pool.query("DELETE FROM tbl_admins WHERE admin_id = $1", [targetId]);

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


