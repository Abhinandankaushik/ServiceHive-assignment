import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth";
import { loginSchema, registerSchema } from "../validators";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, me);

export default router;
