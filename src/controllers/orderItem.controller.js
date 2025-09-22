import prisma from "../config/prisma.js";

// Listar todos os itens de pedidos
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      include: {
        order: true,
        product: true,
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
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: true,
        product: true,
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
    const { quantity, orderId, productId } = req.body;

    let productName = null;
    let unitPrice = null;

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      productName = product.name;
      unitPrice = product.price;
    }

    const orderItem = await prisma.orderItem.create({
      data: {
        quantity,
        unitPrice,
        productId,
        productName,
        orderId,
      },
      include: {
        order: true,
        product: true,
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
    const { quantity, orderId, productId } = req.body;

    const dataToUpdate = {};
    if (quantity !== undefined) dataToUpdate.quantity = quantity;
    if (orderId) dataToUpdate.orderId = orderId;

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      dataToUpdate.productId = productId;
      dataToUpdate.productName = product.name;
      dataToUpdate.unitPrice = product.price;
    }

    const updatedOrderItem = await prisma.orderItem.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
      include: {
        order: true,
        product: true,
      },
    });

    res.json(updatedOrderItem);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Item de pedido não encontrado" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Excluir um item de pedido (exclusão física)
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.orderItem.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Item de pedido excluído com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Item de pedido não encontrado" });
    }
    res.status(500).json({ error: error.message });
  }
};
