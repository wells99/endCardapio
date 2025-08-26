import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
    getOrderItems,
    getOrderItem,
    createOrderItem,
    updateOrderItem,
    deleteOrderItem,
} from "../controllers/orderItem.controller.js";


const router = Router();

// Rota para criar um novo item de opção de produto
router.post("/", authMiddleware, createOrderItem);

// Listar todos os itens de pedidos
// Útil para buscar todos os itens de todos os pedidos
router.get("/", getOrderItems);

// Rota para obter um item de opção de produto específico por ID
router.get("/:id", getOrderItem);

// Rota para atualizar um item de opção de produto
router.put("/:id", authMiddleware, updateOrderItem);

// Rota para deletar um item de opção de produto
router.delete("/:id", authMiddleware, deleteOrderItem);

export default router;
