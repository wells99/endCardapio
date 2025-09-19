import prisma from "../config/prisma.js";

// Listar todos os itens de pedidos (ignorando os deletados)
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: { deletedAt: null }, // só ativos
      include: {
        order: true,
        product: true
      },
    });
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um item de pedido específico
export const getOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const orderItem = await prisma.orderItem.findFirst({
      where: { id: parseInt(id), deletedAt: null }, // só ativo
      include: {
        order: true,
        product: true
      },
    });

    if (!orderItem) {
      return res.status(404).json({ error: "Item de pedido não encontrado" });
    }

    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo item de pedido
export const createOrderItem = async (req, res) => {
  try {
    const { quantity, unitPrice, orderId, productId } = req.body;

    const orderItem = await prisma.orderItem.create({
      data: {
        quantity,
        unitPrice,
        orderId,
        productId,
      },
    });

    res.status(201).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um item de pedido
export const updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unitPrice, orderId, productId } = req.body;

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(id) },
      data: {
        ...(quantity !== undefined && { quantity }),
        ...(unitPrice !== undefined && { unitPrice }),
        ...(orderId && { orderId }),
        ...(productId && { productId }),
      },
    });

    res.json(updatedOrderItem);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Item de pedido não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Soft delete de um item de pedido
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(id) },
      data: { deletedAt: new Date() }, // marca como deletado
    });

    res.json({ message: "Item de pedido deletado com sucesso (soft delete)", deletedOrderItem });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Item de pedido não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};
