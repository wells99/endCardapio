import prisma from "../config/prisma.js";

// Listar todas as Empresas

export const getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" } // Exemplo: ordena por nome em ordem ascendente
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar uma empresa específica
export const getCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.company.findUnique({
      where: { id: parseInt(id) }
    });

    if (!company) {
      return res.status(404).json({ error: "Empresa não encontrado" });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Criar Empresa
export const createCompany = async (req, res) => {
  try {
    const { name, phone, cnpj } = req.body;

    const company = await prisma.company.create({
      data: {
        name,
        phone,
        cnpj,
      },
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Atualizar Empresa
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, cnpj } = req.body;

    const updatedCompany = await prisma.company.update({
      where: { id: parseInt(id) },
      data: {
        // Isso permite atualizar apenas os campos que foram enviados na requisição
        ...(name && { name }),
        ...(phone && { phone }),
        ...(cnpj && { cnpj }),
      },
    });

    res.json(updatedCompany);
  } catch (error) {
    // Adiciona uma verificação para o caso de a empresa não ser encontrada
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Empresa não encontrada." });
    }
    res.status(500).json({ error: error.message });
  }
};

// Deletar Empresa
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCompany = await prisma.company.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "Empresa deletada com sucesso", deletedCompany });
  } catch (error) {
    // Verifica se o erro é "P2025", que significa "registro não encontrado"
    if (error.code === 'P2025') {
      return res.status(404).json({ error: "Empresa não encontrada." });
    }
    // Para outros erros, retorna uma mensagem genérica de erro do servidor
    res.status(500).json({ error: error.message });
  }
};
