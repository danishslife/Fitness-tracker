import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";

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

    const id = Number(payload.userId);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const user = await AppDataSource.getRepository(User).findOneBy({ id });
    if (!user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    res.locals["user"] = user;
    next();
  } catch {
    res.status(401).json({ message: "Authentication required" });
  }
}
