import { pool } from "../../../DB/connection.js";
// Add Admin
export const addAdmin = async (req, res) => {
  try {
    const requester = req.admin;

    // Only super admins can add new admins
    if (requester.role !== "super") {
      return res.status(403).json({ error: "Only super admins can add new admins" });
    }

    const { name, email, phone, password, role } = req.body;

    // check if email already exists
    const emailCheck = await pool.query(
      "SELECT 1 FROM tbl_admins WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // insert new admin
    const query = `
      INSERT INTO tbl_admins (name, email, role, password, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING admin_id, name, email, role, phone
    `;
    const values = [name, email, role, password, phone];
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


