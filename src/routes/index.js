import { Router } from "express";
import authRoutes from "./auth.routes.js";
import categoryRoutes from "./category.routes.js";
import productRoutes from "./product.routes.js";
import clientRoutes from "./client.routes.js";
import companytRoutes from "./company.routes.js";
import productOption from "./productOption.routes.js";
import productOptionItem from "./productOptionItem.routes.js";
import orders from "./orders.routes.js";
import orderItems from "./orderItems.routes.js";
import payments from "./payments.routes.js";

// Relatórios
import reportRoutes from "./report.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);
router.use("/clients", clientRoutes);
router.use("/company", companytRoutes);
router.use("/productOption", productOption);
router.use("/productOptionItem", productOptionItem);
router.use("/orders", orders);
router.use("/orderitems", orderItems);
router.use("/payments", payments);

// Rota para relatório
router.use("/relatorio", reportRoutes);

export default router;