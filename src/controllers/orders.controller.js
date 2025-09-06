import prisma from "../config/prisma.js";

// Listar todos os pedidos
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      // Inclui os itens do pedido, o cliente e o pagamento
      include: {
        items: true,
        client: true,
        payment: true
      },
      orderBy: { createdAt: "desc" }, // Exemplo: ordena por data de criação
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um pedido específico
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true // Inclui os detalhes do produto em cada item
          }
        },
        client: true,
        payment: true
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar um novo pedido (com itens e cliente)
export const createOrder = async (req, res) => {
  try {
    // Desestrutura os campos do corpo da requisição
    const { status, total, tableNumber, orderType, clientId, items } = req.body;

    // Cria o pedido e os itens em uma transação
    const newOrder = await prisma.order.create({
      data: {
        status,
        total,
        tableNumber,
        orderType,
        clientId,
        items: {
          createMany: {
            data: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          },
        },
      },
      include: {
        items: true,
        client: true,
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: error.message });
  }
};

// Atualizar um pedido
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, total, tableNumber, orderType, clientId, items } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                ...(status && { status }),
                ...(total !== undefined && { total }),
                ...(tableNumber !== undefined && { tableNumber }),
                ...(orderType && { orderType }),
                ...(clientId !== undefined && { clientId }),
                // Adiciona o bloco de manipulação de itens
                items: {
                    // O método `set` vai deletar todos os itens antigos
                    // e criar os novos com base no array `items`
                    set: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    })),
                },
            },
            // Inclui a relação `items` na resposta para que o frontend
            // receba a lista de itens atualizada
            include: {
                items: {
                    include: {
                        product: true // Opcional: para retornar o nome do produto
                    }
                }
            }
        });

        res.json(updatedOrder);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }
        res.status(500).json({ error: error.message });
    }
};

// Deletar um pedido
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Deleta o pedido e seus itens relacionados (se houver) em uma transação
    const deletedOrder = await prisma.$transaction([
      // Deleta todos os OrderItems associados ao pedido primeiro
      prisma.orderItem.deleteMany({
        where: { orderId: parseInt(id) },
      }),
      // Depois, deleta o pedido em si
      prisma.order.delete({
        where: { id: parseInt(id) }
      })
    ]);

    res.json({ message: "Pedido e seus itens deletados com sucesso", deletedOrder });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Pedido não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};