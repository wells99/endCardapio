import prisma from "../config/prisma.js";

// Listar todos os produtos
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { sortOrder: "asc" }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um produto específico
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true }
    });

    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar produto
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, available, tags, sortOrder } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const availableBool = available !== undefined ? available === "true" : true;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        available: availableBool,
        tags: tags ? JSON.parse(tags) : [],
        sortOrder: sortOrder ? parseInt(sortOrder) : null,
        categoryId: parseInt(categoryId)
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, available, tags, sortOrder } = req.body;

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        imageUrl,
        available: available !== undefined ? available : undefined,
        tags: tags ? JSON.parse(tags) : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
        categoryId: categoryId !== undefined ? parseInt(categoryId) : undefined
      }
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Deletar produto
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
