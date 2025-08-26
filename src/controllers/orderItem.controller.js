import prisma from "../config/prisma.js";

// Listar todos os itens de pedidos
// Útil para buscar todos os itens de todos os pedidos
export const getOrderItems = async (req, res) => {
  try {
    const orderItems = await prisma.orderItem.findMany({
      // Inclui o pedido e o produto relacionados a cada item
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
// Útil para buscar um único item por seu ID
export const getOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: parseInt(id) },
      // Inclui o pedido e o produto relacionados
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
// Esta função pode ser usada para adicionar um item a um pedido existente
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
        // Permite atualizar apenas os campos que foram enviados
        ...(quantity !== undefined && { quantity }),
        ...(unitPrice !== undefined && { unitPrice }),
        ...(orderId && { orderId }),
        ...(productId && { productId }),
      },
    });

    res.json(updatedOrderItem);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Item de pedido não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar um item de pedido
export const deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrderItem = await prisma.orderItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Item de pedido deletado com sucesso", deletedOrderItem });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Item de pedido não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};
