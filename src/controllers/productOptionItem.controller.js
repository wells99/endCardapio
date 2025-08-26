import prisma from "../config/prisma.js";

// Listar todos os itens de opção de produto
export const getProductOptionItems = async (req, res) => {
  try {
    const productOptionItems = await prisma.productOptionItem.findMany({
      // Ordena por nome em ordem ascendente
      orderBy: { name: "asc" },
      // Inclui a opção de produto relacionada a cada item
      include: { 
        option: true 
      }, 
    });
    res.json(productOptionItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um item de opção de produto específico
export const getProductOptionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const productOptionItem = await prisma.productOptionItem.findUnique({
      where: { id: parseInt(id) },
      // Inclui a opção de produto relacionada
      include: {
        option: true
      },
    });

    if (!productOptionItem) {
      return res.status(404).json({ error: "Item de opção de produto não encontrado" });
    }

    res.json(productOptionItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar Item de Opção de Produto
export const createProductOptionItem = async (req, res) => {
  try {
    // Desestrutura os campos da sua model (name, price, optionId)
    const { name, price, optionId } = req.body;

    const productOptionItem = await prisma.productOptionItem.create({
      data: {
        name,
        price,
        optionId,
      },
    });

    res.status(201).json(productOptionItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar Item de Opção de Produto
export const updateProductOptionItem = async (req, res) => {
  try {
    const { id } = req.params;
    // Desestrutura os campos que podem ser atualizados
    const { name, price, optionId } = req.body;

    const updatedProductOptionItem = await prisma.productOptionItem.update({
      where: { id: parseInt(id) },
      data: {
        // Permite atualizar apenas os campos que foram enviados na requisição
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(optionId && { optionId }),
      },
    });

    res.json(updatedProductOptionItem);
  } catch (error) {
    // Adiciona uma verificação para o caso de o item não ser encontrado
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Item de opção de produto não encontrado." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar Item de Opção de Produto
export const deleteProductOptionItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Tenta deletar o item de opção de produto
    const deletedProductOptionItem = await prisma.productOptionItem.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Item de opção de produto deletado com sucesso", deletedProductOptionItem });
  } catch (error) {
    // Verifica se o erro é "P2025", que significa "registro não encontrado"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Item de opção de produto não encontrado." });
    }
    // Para outros erros, retorna uma mensagem genérica de erro do servidor
    res.status(500).json({ error: error.message });
  }
};
