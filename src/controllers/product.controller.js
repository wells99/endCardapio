import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { promisify } from 'util';
import fs from 'fs';

// Listar todos os produtos (apenas não deletados)
export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { deleted: false }, // 👈 ajuste aqui
      include: { category: true },
      orderBy: { sortOrder: "asc" }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar um produto específico (ignora os deletados)
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({ // 👈 findFirst permite where composto
      where: { id: parseInt(id), deleted: false },
      include: { category: true }
    });

    if (!product) return res.status(404).json({ error: "Produto não encontrado" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar produto
const unlinkAsync = promisify(fs.unlink);

export const createProduct = async (req, res) => {
  try {
    console.log("Guardando o PRODUTO");
    const { name, description, price, categoryId, available, sortOrder } = req.body;
    let imageUrl = "Esse campo deve ser enviado com o nome:image";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;
      await unlinkAsync(req.file.path);
    }
  
    const availableBool = available !== undefined ? available === "true" : true;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        available: availableBool,
        sortOrder: sortOrder ? parseInt(sortOrder) : null,
        categoryId: parseInt(categoryId),
        deleted: false // 👈 novo campo default
      }
    });

    console.log("PRODUTO foi Guardado com Sucesso!!");
    res.status(201).json(product);
  } catch (error) {
    if (req.file) {
      await unlinkAsync(req.file.path).catch(err => console.error("Erro ao remover o arquivo temporário:", err));
    }
    res.status(500).json({ error: error.message });
  }
};

// Atualizar produto
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, categoryId, available, sortOrder } = req.body;
    let imageUrl = undefined;
    let oldProduct = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;
      await unlinkAsync(req.file.path);
      oldProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });
    }

    const availableBool = available !== undefined ? available === "true" : undefined;

    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(available !== undefined && { available: availableBool }),
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      ...(categoryId !== undefined && { categoryId: parseInt(categoryId) })
    };

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nenhum dado válido para atualizar foi fornecido." });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    if (oldProduct?.imageUrl && req.file) {
      const publicId = oldProduct.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.json(product);
  } catch (error) {
    if (req.file) {
      await unlinkAsync(req.file.path).catch(err => console.error("Erro ao remover o arquivo temporário:", err));
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar produto (soft delete)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.update({
      where: { id: parseInt(id) },
      data: { deleted: true } // 👈 ajuste principal
    });

    res.json({ message: "Produto marcado como deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
