import {Router} from "express";
import {deleteAsset,getPortfolioSummary,upsertAsset} from "../controllers/portfolioController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = Router();
router.use(authMiddleware);
router.get("/summary",getPortfolioSummary);
router.post("/",upsertAsset);
router.delete("/:id",deleteAsset);
export default router;
