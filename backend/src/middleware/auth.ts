import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtPayload, Role } from "../types";
import { ApiError } from "./error";

export const protect = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw new ApiError("Not authorized, no token", 401);
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    throw new ApiError("Not authorized, token failed", 401);
  }
};

export const authorize =
  (...roles: Role[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError("Forbidden: insufficient role", 403);
    }
    next();
  };
