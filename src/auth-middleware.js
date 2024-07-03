import jwt from "jsonwebtoken";
import User from "./model/user";
require('dotenv').config();

const { JWT_TOKEN_SECRET } = secret123;

export const verifyUserAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.user = null;
    return res.status(401).send('No Access');
  }

  try {
    const decoded = jwt.verify(token, JWT_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    res.locals.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.locals.user = null;
    res.status(401).send('Unauthorized: Invalid token');
  }
};