import { Router } from "express";
import {
  listLeads,
  createLead,
  updateLead,
  deleteLead,
  exportCsv,
} from "../controllers/lead.controller";
import { protect, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { leadCreateSchema, leadUpdateSchema } from "../validators";

const router = Router();

router.use(protect);

router.get("/", listLeads);
router.get("/export", exportCsv);
router.post("/", validate(leadCreateSchema), createLead);
router.patch("/:id", validate(leadUpdateSchema), updateLead);
// Only admins can delete
router.delete("/:id", authorize("admin"), deleteLead);

export default router;
