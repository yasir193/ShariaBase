import { pool } from "../../../DB/connection.js";

// Upload File
export const uploadFile = async (req, res) => {
  const { jsonData, fileName, userId } = req.body;
  // const userId = req.user.user_id; 

  try {
    if (!fileName) {
      return res.status(400).json({
        status: "error",
        message: "fileName is required",
      });
    }

    const result = await pool.query(
      `INSERT INTO tbl_files 
        (file_name, user_id, original_version, last_edits_version)
        VALUES ($1, $2, $3, $4)
        RETURNING file_id, file_name, createdat`,
      [fileName, userId, jsonData, null]
    );

    res.status(201).json({
      status: "Saved successfully",
      data: {
        fileId: result.rows[0].file_id,
        fileName: result.rows[0].file_name,
        createdAt: result.rows[0].createdat,
      },
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({
      status: "error",
      message: "Failed to save file",
    });
  }
};


// Update File
export const updateFile = async (req, res) => {
  const { fileId } = req.params;
  const { jsonData , userId } = req.body;
  // const userId = req.user.user_id; 

  try {
    const fileCheck = await pool.query(
      `SELECT file_id FROM tbl_files 
        WHERE file_id = $1 AND user_id = $2`,
      [fileId, userId]
    );

    if (fileCheck.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "File not found or unauthorized",
      });
    }

    const result = await pool.query(
      `UPDATE tbl_files 
        SET last_edits_version = $1, updatedat = CURRENT_TIMESTAMP
        WHERE file_id = $2 AND user_id = $3
        RETURNING file_id, file_name, updatedat`,
      [jsonData, fileId, userId]
    );

    res.status(200).json({
      status: "success",
      data: {
        fileId: result.rows[0].file_id,
        fileName: result.rows[0].file_name,
        updatedAt: result.rows[0].updatedat,
      },
    });
  } catch (err) {
    console.error("Database error:", err);

    if (err.code === "22P02") {
      return res.status(400).json({
        status: "error",
        message: "Invalid JSON data format",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Failed to update file",
      details:
        process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
