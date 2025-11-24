const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getStats = async (req, res) => {
  try {
    // Get counts
    const [
      totalClients,
      totalMasters,
      totalSuperMasters,
      totalDeposits,
      totalWithdrawals,
      pendingKYC,
      activeAccounts
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.user.count({ where: { role: 'MASTER' } }),
      prisma.user.count({ where: { role: 'SUPER_MASTER' } }),
      prisma.depositRequest.count({ where: { status: 'PENDING' } }),
      prisma.withdrawalRequest.count({ where: { status: 'PENDING' } }),
      prisma.kYCProfile.count({ where: { status: 'PENDING' } }),
      prisma.tradingAccount.count({ where: { status: 'ACTIVE' } })
    ]);

    // Get today's deposits sum
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayDeposits = await prisma.depositRequest.aggregate({
      where: {
        createdAt: { gte: today },
        status: 'APPROVED'
      },
      _sum: { amount: true }
    });

    // Get today's withdrawals sum
    const todayWithdrawals = await prisma.withdrawalRequest.aggregate({
      where: {
        createdAt: { gte: today },
        status: { in: ['APPROVED', 'PENDING'] }
      },
      _sum: { amount: true }
    });

    // Get recent deposits
    const recentDeposits = await prisma.depositRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    // Get recent withdrawals
    const recentWithdrawals = await prisma.withdrawalRequest.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      data: {
        totalClients,
        totalMasters: totalMasters + totalSuperMasters,
        todayDeposits: parseFloat(todayDeposits._sum.amount || 0),
        todayWithdrawals: parseFloat(todayWithdrawals._sum.amount || 0),
        pendingKYC,
        activeAccounts,
        pendingDeposits: totalDeposits,
        pendingWithdrawals: totalWithdrawals,
        recentDeposits: recentDeposits.map(d => ({
          id: d.id,
          name: d.user.name,
          amount: parseFloat(d.amount),
          date: d.createdAt,
          status: d.status
        })),
        recentWithdrawals: recentWithdrawals.map(w => ({
          id: w.id,
          name: w.user.name,
          amount: parseFloat(w.amount),
          date: w.createdAt,
          status: w.status
        }))
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getStats };
