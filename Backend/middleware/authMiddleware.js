import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  // 1) No token → not logged in
  if (!token) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  try {
    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Attach user info to request
    req.user = decoded; // { id: userId }

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
