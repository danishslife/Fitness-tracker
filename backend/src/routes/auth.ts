import type { Request, Response } from "express";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { z } from "zod";
import { validateBody } from "../middlewares/schemaValidator";
import { requireAuth } from "../middlewares/requireAuth";

const registerSchema = z.object({
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address")),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address")),
  password: z.string().min(1, "Password is required"),
});

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

function signToken(userId: string) {
  return jwt.sign({ userId }, jwtSecret as string, {
    expiresIn: "7d",
  });
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number }).code === 11000
  );
}

// Register User

router.post(
  "/register",
  validateBody(registerSchema),
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    try {
      const user = new User({ firstName, lastName, email, password });
      await user.save();

      res.status(201).json({
        token: signToken(String(user._id)),
        user: { _id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName },
      });
    } catch (error: unknown) {
      if (isDuplicateKeyError(error)) {
        res.status(409).json({ message: "Email is already registered" });
        return;
      }
      const message =
        error instanceof Error ? error.message : "An error occured";
      res.status(500).json({ message });
    }
  },
);

router.post(
  "/login",
  validateBody(loginSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      res.json({
        token: signToken(String(user._id)),
        user: {
          _id: user._id,
          email: user.email,
          lastName: user.lastName,
          firstName: user.firstName,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "An error occured";
      res.status(500).json({ message });
    }
  },
);

router.get("/me", requireAuth, (req: Request, res: Response) => {
  const user = res.locals["user"];
  res.json({
    user: {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

export default router;
