import { pool } from "../../../DB/connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

export const signUp = async (req, res) => {
  
  
  
  try {
    const {
      name,
      email,
      job_title,
      typeOfUser,
      business_name,
      business_sector,
      password,
      confirmPassword,
      phone,
    } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and Confirm Password doesn't match" });
    }

    // check if email exists
    const emailCheck = await pool.query(
      "SELECT 1 FROM tbl_users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // hash password
    const hashedPassword =  bcrypt.hashSync(password, +process.env.SALT);

    // encrypt phone
    const encryptedPhone = CryptoJS.AES.encrypt(
      phone,
      process.env.CRYPTO_SECRET
    ).toString();

    // insert user
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
      hashedPassword,
      encryptedPhone,
    ];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    res.status(201).json({
      message: "User registered successfully!",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Sign In
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user
    const result = await pool.query(
      "SELECT * FROM tbl_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0];

    // compare password
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // generate JWT
    const accesstoken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      accesstoken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
