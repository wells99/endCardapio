import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import clientRoutes from "./client.routes.js";
import companytRoutes from "./company.routes.js";



const router = Router();

router.use("/auth", authRoutes);

router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/clients", clientRoutes);
router.use("/company",companytRoutes);



export default router;
