import prisma from "../config/prisma.js";

// Listar todas os Clientes

export const getClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" }, // Exemplo: ordena por nome em ordem ascendente
      include: { orders: true } // Inclui os pedidos de cada cliente
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um cliente específico
export const getClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: { orders: true } // Inclui os pedidos do cliente
    });

    if (!client) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar Cliente
export const createClient = async (req, res) => {
  try {
    // Desestrutura os campos corretos do corpo da requisição (name, phone, address)
    const { name, phone, address } = req.body;

    const client = await prisma.client.create({
      data: {
        name,
        phone,
        address,
      },
    });

    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar Cliente
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    const updatedClient = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        // Isso permite atualizar apenas os campos que foram enviados na requisição
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
      },
    });

    res.json(updatedClient);
  } catch (error) {
    // Adiciona uma verificação para o caso de o cliente não ser encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Cliente não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar Cliente
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // Tenta deletar o cliente
    const deletedClient = await prisma.client.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Cliente deletado com sucesso", deletedClient });
  } catch (error) {
    // Verifica se o erro é "P2025", que significa "registro não encontrado"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Cliente não encontrado." });
    }
    // Para outros erros, retorna uma mensagem genérica de erro do servidor
    res.status(500).json({ error: error.message });
  }
};
