const { PrismaClient } = require('@prisma/client');
const mt5Service = require('../../services/mt5Service');
const prisma = new PrismaClient();

// Get all deposits
const getAllDeposits = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [deposits, total] = await Promise.all([
      prisma.depositRequest.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              tradingAccounts: {
                select: { mt5Login: true, balance: true },
                take: 1
              }
            }
          }
        }
      }),
      prisma.depositRequest.count({ where })
    ]);

    const formattedDeposits = deposits.map(deposit => ({
      id: deposit.id,
      userId: deposit.userId,
      userName: deposit.user.name,
      userEmail: deposit.user.email,
      amount: parseFloat(deposit.amount),
      currency: deposit.currency,
      method: deposit.method,
      proofUrl: deposit.proofUrl,
      status: deposit.status,
      mt5Login: deposit.user.tradingAccounts[0]?.mt5Login || null,
      createdAt: deposit.createdAt,
      approvedBy: deposit.approvedBy,
      approvedAt: deposit.approvedAt,
      rejectionReason: deposit.rejectionReason
    }));

    res.json({
      success: true,
      data: formattedDeposits,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get deposits error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Approve deposit
const approveDeposit = async (req, res) => {
  try {
    const { id } = req.params;

    const existingDeposit = await prisma.depositRequest.findUnique({
      where: { id },
      include: { 
        user: { 
          include: { 
            wallet: true,
            tradingAccounts: { take: 1 }
          } 
        } 
      }
    });

    if (!existingDeposit) {
      return res.status(404).json({ success: false, message: 'Deposit not found' });
    }

    if (existingDeposit.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: 'Deposit already processed' });
    }

    // Update deposit status
    const deposit = await prisma.depositRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        approvedBy: req.user.id,
        approvedAt: new Date()
      }
    });

    // Create or update wallet
    let wallet = existingDeposit.user.wallet;
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          userId: existingDeposit.userId,
          currency: deposit.currency,
          availableBalance: deposit.amount,
          lockedBalance: 0
        }
      });
    } else {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          availableBalance: { increment: deposit.amount }
        }
      });
    }

    // Create wallet ledger entry
    await prisma.walletLedger.create({
      data: {
        walletId: wallet.id,
        type: 'DEPOSIT',
        amount: deposit.amount,
        currency: deposit.currency,
        refNo: deposit.id,
        metaJson: JSON.stringify({
          method: deposit.method,
          approvedBy: req.user.id
        })
      }
    });

    // Update MT5 balance
    if (existingDeposit.user.tradingAccounts[0]) {
      try {
        await mt5Service.updateBalance(
          existingDeposit.user.tradingAccounts[0].mt5Login,
          parseFloat(deposit.amount),
          'DEPOSIT',
          `Deposit approved - ${deposit.id}`
        );

        // Update trading account balance in DB
        await prisma.tradingAccount.update({
          where: { id: existingDeposit.user.tradingAccounts[0].id },
          data: {
            balance: { increment: deposit.amount }
          }
        });
      } catch (mt5Error) {
        console.error('MT5 Update Error:', mt5Error);
        // Continue even if MT5 fails
      }
    }

    res.json({
      success: true,
      message: 'Deposit approved successfully',
      data: deposit
    });
  } catch (error) {
    console.error('Approve deposit error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reject deposit
const rejectDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const deposit = await prisma.depositRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason
      }
    });

    res.json({
      success: true,
      message: 'Deposit rejected',
      data: deposit
    });
  } catch (error) {
    console.error('Reject deposit error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllDeposits,
  approveDeposit,
  rejectDeposit
};
