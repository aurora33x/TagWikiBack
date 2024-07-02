import jwt from "jsonwebtoken";
import User from "../model/user";

const secret = 'secret123';

export function getUser(token) {
  const user = jwt.verify(token, secret);
  return User.findById(user.id);
}