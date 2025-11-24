const { PrismaClient } = require('@prisma/client');
const mt5Service = require('../../services/mt5Service');

const prisma = new PrismaClient();

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user with trading account and wallet
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tradingAccounts: { take: 1 },
        wallet: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get MT5 account info
    let mt5Account = null;
    if (user.tradingAccounts[0]) {
      try {
        mt5Account = await mt5Service.getAccountInfo(user.tradingAccounts[0].mt5Login);
      } catch (error) {
        console.error('MT5 error:', error);
      }
    }

    // Get open positions
    let openPositions = [];
    if (user.tradingAccounts[0]) {
      try {
        openPositions = await mt5Service.getOpenPositions(user.tradingAccounts[0].mt5Login);
      } catch (error) {
        console.error('Positions error:', error);
      }
    }

    res.json({
      success: true,
      data: {
        mt5Account: mt5Account || {
          login: user.tradingAccounts[0]?.mt5Login || null,
          balance: 0,
          equity: 0,
          margin: 0,
          freeMargin: 0,
          marginLevel: 0,
          credit: 0
        },
        wallet: {
          availableBalance: user.wallet ? parseFloat(user.wallet.availableBalance) : 0,
          lockedBalance: user.wallet ? parseFloat(user.wallet.lockedBalance) : 0,
          totalBalance: user.wallet ? 
            parseFloat(user.wallet.availableBalance) + parseFloat(user.wallet.lockedBalance) : 0
        },
        openPositions: openPositions.slice(0, 5)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get account info
const getAccountInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    const tradingAccount = await prisma.tradingAccount.findFirst({
      where: { userId }
    });

    if (!tradingAccount) {
      return res.status(404).json({ success: false, message: 'Trading account not found' });
    }

    let mt5Info = null;
    try {
      mt5Info = await mt5Service.getAccountInfo(tradingAccount.mt5Login);
    } catch (error) {
      console.error('MT5 error:', error);
    }

    res.json({
      success: true,
      data: mt5Info || tradingAccount
    });
  } catch (error) {
    console.error('Account info error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get open positions
const getOpenPositions = async (req, res) => {
  try {
    const userId = req.user.id;

    const tradingAccount = await prisma.tradingAccount.findFirst({
      where: { userId }
    });

    if (!tradingAccount) {
      return res.json({ success: true, data: [] });
    }

    const positions = await mt5Service.getOpenPositions(tradingAccount.mt5Login);

    res.json({
      success: true,
      data: positions
    });
  } catch (error) {
    console.error('Positions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get recent transactions
const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet) {
      return res.json({ success: true, data: [] });
    }

    const transactions = await prisma.walletLedger.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error('Transactions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getDashboardStats,
  getAccountInfo,
  getOpenPositions,
  getRecentTransactions
};
