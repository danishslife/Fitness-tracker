import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const token = header.slice("Bearer ".length);

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  try {
    const payload = jwt.verify(token.trim(), jwtSecret);

    if (
      typeof payload != "object" ||
      payload === null ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    res.locals["user"] = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication required" });
  }
}
