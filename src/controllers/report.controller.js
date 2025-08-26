import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDailySummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const totalSalesCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: "completed",
      },
    });

    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        status: "completed",
      },
    });

    const totalRevenue = totalRevenueResult._sum.total || 0;

    res.status(200).json({
      totalRevenue: totalRevenue,
      totalSales: totalSalesCount,
      date: today.toISOString().split('T')[0],
    });

  } catch (error) {
    console.error("Erro ao gerar o relatório diário:", error);
    res.status(500).json({ message: "Erro ao gerar o relatório diário." });
  }
};