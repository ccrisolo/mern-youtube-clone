import jwt from "jsonwebtoken";

const SECRET = process.env.SECRET;

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ err: "Missing authorization token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ err: "Invalid token" });
  }
}
