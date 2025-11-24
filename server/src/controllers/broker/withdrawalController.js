const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get withdrawals
    const [withdrawals, total] = await Promise.all([
      prisma.withdrawalRequest.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              tradingAccounts: {
                select: {
                  mt5Login: true,
                  balance: true
                },
                take: 1
              }
            }
          }
        }
      }),
      prisma.withdrawalRequest.count({ where })
    ]);

    // Format data
    const formattedWithdrawals = withdrawals.map(withdrawal => ({
      id: withdrawal.id,
      userId: withdrawal.userId,
      userName: withdrawal.user.name,
      userEmail: withdrawal.user.email,
      amount: parseFloat(withdrawal.amount),
      currency: withdrawal.currency,
      method: withdrawal.method,
      upiId: withdrawal.upiId,
      accountNumber: withdrawal.accountNumber,
      ifscCode: withdrawal.ifscCode,
      status: withdrawal.status,
      mt5Login: withdrawal.user.tradingAccounts[0]?.mt5Login || null,
      mt5Balance: withdrawal.user.tradingAccounts[0]?.balance ? parseFloat(withdrawal.user.tradingAccounts[0].balance) : 0,
      createdAt: withdrawal.createdAt,
      approvedBy: withdrawal.approvedBy,
      approvedAt: withdrawal.approvedAt,
      paidAt: withdrawal.paidAt,
      utrNumber: withdrawal.utrNumber,
      rejectionReason: withdrawal.rejectionReason
    }));

    res.json({
      success: true,
      data: formattedWithdrawals,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Approve withdrawal
const approveWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { utrNumber } = req.body;

    // Get withdrawal first
    const existingWithdrawal = await prisma.withdrawalRequest.findUnique({
      where: { id },
      include: { user: { include: { wallet: true } } }
    });

    if (!existingWithdrawal) {
      return res.status(404).json({
        success: false,
        message: 'Withdrawal not found'
      });
    }

    // Check if wallet has sufficient balance
    if (!existingWithdrawal.user.wallet || 
        parseFloat(existingWithdrawal.user.wallet.availableBalance) < parseFloat(existingWithdrawal.amount)) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Update withdrawal status
    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date(),
        paidAt: new Date(),
        utrNumber: utrNumber || null
      }
    });

    // Update wallet balance
    await prisma.wallet.update({
      where: { id: existingWithdrawal.user.wallet.id },
      data: {
        availableBalance: {
          decrement: withdrawal.amount
        }
      }
    });

    // Create wallet ledger entry
    await prisma.walletLedger.create({
      data: {
        walletId: existingWithdrawal.user.wallet.id,
        type: 'WITHDRAWAL',
        amount: withdrawal.amount,
        currency: withdrawal.currency,
        refNo: withdrawal.id,
        metaJson: JSON.stringify({
          method: withdrawal.method,
          utrNumber: utrNumber,
          approvedBy: req.user.id
        })
      }
    });

    res.json({
      success: true,
      message: 'Withdrawal approved successfully',
      data: withdrawal
    });
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Reject withdrawal
const rejectWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const withdrawal = await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason
      }
    });

    res.json({
      success: true,
      message: 'Withdrawal rejected',
      data: withdrawal
    });
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal
};
