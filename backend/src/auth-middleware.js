import jwt from "jsonwebtoken";
import User from "./model/user";

// Require variables from .env file
require('dotenv').config();
const { JWT_TOKEN_SECRET } = process.env;

// Protect routes by verifying user token and checking db
export const verifyUserAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    // To be in sync with db we should receive user data from db
    // each time we accessing routes with authentication
    res.locals.user = null;
    return res.status(401).send('No Access');
  }

  try {
    // Verify jwt token
    const decoded = await jwt.verify(token, 'secret123');

    // Search if user id exists in database
    const user = await User.findById(decoded.id);
    res.locals.user = user;
    next();
  } catch (err) {
    res.locals.user = null;
    res.status(401).send('No Access');
  }
};
