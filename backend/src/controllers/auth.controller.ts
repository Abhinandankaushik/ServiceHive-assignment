import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { ApiError } from "../middleware/error";
import { JwtPayload, Role } from "../types";

const signToken = (id: string, role: Role): string => {
  const secret = process.env.JWT_SECRET as string;
  const payload: JwtPayload = { id, role };
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError("Email already registered", 409);

  const user = await User.create({ name, email, password, role: role ?? "sales" });
  const token = signToken(user.id, user.role);

  res.status(201).json({
    success: true,
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError("Invalid credentials", 401);

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError("Invalid credentials", 401);

  const token = signToken(user.id, user.role);
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById((req as Request & { user?: { id: string } }).user?.id);
  if (!user) throw new ApiError("User not found", 404);
  res.json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});
