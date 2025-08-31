import prisma from "../config/prisma.js";
// Listar todas as opções de produto
export const getProductOptions = async (req, res) => {
  try {
    const productOptions = await prisma.productOption.findMany({
      // Ordena por nome em ordem ascendente
      orderBy: { name: "asc" },
      // Inclui os itens e o produto relacionado a cada opção
      include: { 
        items: true,
        product: true
      }, 
    });
    res.json(productOptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar uma opção de produto específica
export const getProductOption = async (req, res) => {
  try {
    const { id } = req.params;
    const productOption = await prisma.productOption.findUnique({
      where: { id: parseInt(id) },
      // Inclui os itens e o produto relacionado
      include: {
        items: true,
        product: true
      },
    });

    if (!productOption) {
      return res.status(404).json({ error: "Opção de produto não encontrada" });
    }

    res.json(productOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar Opção de Produto
export const createProductOption = async (req, res) => {
  try {
    // Desestrutura os campos da sua model (name, type, productId)
    const { name, type, productId } = req.body;

    const productOption = await prisma.productOption.create({
      data: {
        name,
        type,
        productId,
      },
    });

    res.status(201).json(productOption);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar Opção de Produto
export const updateProductOption = async (req, res) => {
  try {
    const { id } = req.params;
    // Desestrutura os campos que podem ser atualizados
    const { name, type, productId } = req.body;

    const updatedProductOption = await prisma.productOption.update({
      where: { id: parseInt(id) },
      data: {
        // Permite atualizar apenas os campos que foram enviados na requisição
        ...(name && { name }),
        ...(type && { type }),
        ...(productId && { productId }),
      },
    });

    res.json(updatedProductOption);
  } catch (error) {
    // Adiciona uma verificação para o caso de a opção não ser encontrada
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Opção de produto não encontrada." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar Opção de Produto
export const deleteProductOption = async (req, res) => {
  try {
    const { id } = req.params;

    // Tenta deletar a opção de produto
    const deletedProductOption = await prisma.productOption.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Opção de produto deletada com sucesso", deletedProductOption });
  } catch (error) {
    // Verifica se o erro é "P2025", que significa "registro não encontrado"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Opção de produto não encontrada." });
    }
    // Para outros erros, retorna uma mensagem genérica de erro do servidor
    res.status(500).json({ error: error.message });
  }
};
