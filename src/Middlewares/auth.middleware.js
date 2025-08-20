import jwt from "jsonwebtoken";
export const authenticate = ( req, res, next) => {
  try {
    const token = req.headers.accesstoken;

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
