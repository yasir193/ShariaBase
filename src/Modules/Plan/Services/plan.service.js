import { pool } from "../../../DB/connection.js";
export const addSubscription = async (req, res) => {
  try {
    const {
      plan_name,
      daily_requests_per_day,
      refine_requests,
      number_of_uploads,
    } = req.body;
    const query = `
      INSERT INTO tbl_plans (plan_name, daily_requests_per_day, refine_requests, number_of_uploads)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    const values = [
      plan_name,
      daily_requests_per_day,
      refine_requests,
      number_of_uploads,
    ];
    const result = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "Creation Success!", data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import { pool } from "../../../DB/connection.js";

// Get all plans
export const getAllPlans = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT plan_id, plan_name, daily_requests_per_day, refine_requests, number_of_uploads 
       FROM tbl_plans 
       ORDER BY plan_id ASC`
    );

    res.status(200).json({
      message: "Plans fetched successfully",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM tbl_plans WHERE plan_id = $1 RETURNING *";
    const value = [id];
    const result = await pool.query(query, value);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: `Plan with ID ${id} not found`,
      });
    }

    res.status(200).json({
      message: "Subscription deleted successfully",
      deletedPlan: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
