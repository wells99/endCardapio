import prisma from "../config/prisma.js";

// Listar todos os pagamentos
export const getPayments = async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      // Inclui o pedido relacionado a cada pagamento
      include: {
        order: true
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obter um pagamento específico por ID
export const getPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: parseInt(id) },
      include: {
        order: true
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo pagamento
export const createPayment = async (req, res) => {
  try {
    const { method, amount, status, paidAt, orderId } = req.body;

    // Verifica se já existe um pagamento para o pedido
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: parseInt(orderId) },
    });

    if (existingPayment) {
      return res.status(409).json({ error: "Já existe um pagamento para este pedido." });
    }

    const newPayment = await prisma.payment.create({
      data: {
        method,
        amount,
        status,
        paidAt,
        orderId,
      },
    });

    // Opcionalmente, você pode atualizar o status do pedido aqui
    // await prisma.order.update({
    //   where: { id: parseInt(orderId) },
    //   data: { status: "paid" },
    // });

    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um pagamento
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, amount, status, paidAt } = req.body;

    const updatedPayment = await prisma.payment.update({
      where: { id: parseInt(id) },
      data: {
        ...(method && { method }),
        ...(amount !== undefined && { amount }),
        ...(status && { status }),
        ...(paidAt && { paidAt }),
      },
    });

    res.json(updatedPayment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar um pagamento
export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPayment = await prisma.payment.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Pagamento deletado com sucesso", deletedPayment });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Pagamento não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};
