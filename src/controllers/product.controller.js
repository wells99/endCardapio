import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { promisify } from 'util';
import fs from 'fs';

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
// Use util.promisify para converter fs.unlink em uma função que retorna uma Promise
const unlinkAsync = promisify(fs.unlink);

export const createProduct = async (req, res) => {
  try {
    console.log("Guardando o PRODUTO")
    const { name, description, price, categoryId, available, tags, sortOrder } = req.body;
    let imageUrl = "Esse campo deve ser enviado com o nome:image";

    if (req.file) {
      // O Multer já fez o upload para uma pasta temporária.
      // Agora, fazemos o upload do arquivo temporário para o Cloudinary.
      const uploadResult = await cloudinary.uploader.upload(req.file.path);

      // A URL da imagem no Cloudinary é o resultado que precisamos.
      imageUrl = uploadResult.secure_url;

      // Opcional: Remova o arquivo temporário do servidor local após o upload para o Cloudinary.
      // Isso ajuda a manter seu servidor limpo.
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
        tags: tags ? JSON.parse(tags) : [],
        sortOrder: sortOrder ? parseInt(sortOrder) : null,
        categoryId: parseInt(categoryId)
      }

    });
    console.log("PRODUTO foi Guardado com Sucesso!!")
    res.status(201).json(product);
  } catch (error) {
    // Se ocorrer um erro, você pode verificar se o arquivo temporário existe
    // e removê-lo para evitar que ele permaneça no servidor.
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
    const { name, description, price, categoryId, available, tags, sortOrder } = req.body;
    let imageUrl = undefined;
    let oldProduct = null;

    if (req.file) {
      // Se um novo arquivo de imagem foi enviado, faça o upload para o Cloudinary.
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      imageUrl = uploadResult.secure_url;

      // Opcional: Remova o arquivo temporário do servidor local após o upload.
      await unlinkAsync(req.file.path);

      // Busque o produto existente para obter a URL da imagem antiga
      // para poder removê-la do Cloudinary, se necessário.
      oldProduct = await prisma.product.findUnique({ where: { id: parseInt(id) } });

    }

    // Converta o valor 'available' para boolean, se ele for fornecido.
    const availableBool = available !== undefined ? available === "true" : undefined;

    // O objeto 'data' só deve conter campos que realmente foram passados no body.
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(available !== undefined && { available: availableBool }),
      ...(tags && { tags: JSON.parse(tags) }),
      ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder) }),
      ...(categoryId !== undefined && { categoryId: parseInt(categoryId) })
    };

    // Se não houver dados para atualizar, retorne uma resposta.
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Nenhum dado válido para atualizar foi fornecido." });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    // Se um novo upload ocorreu e o produto antigo tinha uma imagem, 
    // você pode considerar remover a imagem antiga do Cloudinary para economizar espaço.
    if (oldProduct?.imageUrl && req.file) {
      // Extrair o public_id da URL do Cloudinary para deletar o arquivo.
      const publicId = oldProduct.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    res.json(product);
  } catch (error) {
    // Se ocorrer um erro, verifique se o arquivo temporário existe e remova-o.
    if (req.file) {
      await unlinkAsync(req.file.path).catch(err => console.error("Erro ao remover o arquivo temporário:", err));
    }
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
