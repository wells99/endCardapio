import prisma from "../config/prisma.js";

// Listar todas as categorias
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { products: true } // inclui produtos de cada categoria
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar uma categoria específica
export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: { products: true }
    });

    if (!category) return res.status(404).json({ error: "Categoria não encontrada" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar categoria
export const createCategory = async (req, res) => {
  try {
    const { name, sortOrder } = req.body;

    const category = await prisma.category.create({
      data: { name, sortOrder }
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar categoria
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sortOrder } = req.body;

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: { name, sortOrder }
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar categoria
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
