const { PrismaClient } = require('@prisma/client');
const mt5Service = require('../../services/mt5Service');
const prisma = new PrismaClient();

// Create withdrawal request
const createWithdrawalRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, method, bankDetails, upiDetails } = req.body;

    if (!amount || parseFloat(amount) < 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum withdrawal amount is ₹1,000' 
      });
    }

    // Get wallet balance
    const wallet = await prisma.wallet.findFirst({
      where: { userId }
    });

    if (!wallet || parseFloat(wallet.availableBalance) < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Insufficient balance' 
      });
    }

    // Get MT5 account to check free margin
    const tradingAccount = await prisma.tradingAccount.findFirst({
      where: { userId }
    });

    if (tradingAccount) {
      try {
        const mt5Info = await mt5Service.getAccountInfo(tradingAccount.mt5Login);
        if (mt5Info.freeMargin < parseFloat(amount)) {
          return res.status(400).json({ 
            success: false, 
            message: 'Insufficient free margin. Please close some positions first.' 
          });
        }
      } catch (error) {
        console.error('MT5 check error:', error);
      }
    }

    // Create withdrawal request
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: 'INR',
        method,
        accountNumber: method === 'BANK_TRANSFER' ? bankDetails?.accountNumber : null,
        ifscCode: method === 'BANK_TRANSFER' ? bankDetails?.ifscCode : null,
        accountHolderName: method === 'BANK_TRANSFER' ? bankDetails?.accountName : null,
        bankName: method === 'BANK_TRANSFER' ? bankDetails?.bankName : null,
        upiId: method === 'UPI' ? upiDetails?.upiId : null,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      data: withdrawal
    });
  } catch (error) {
    console.error('Create withdrawal error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get withdrawal history
const getWithdrawalHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const withdrawals = await prisma.withdrawalRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: withdrawals.map(w => ({
        id: w.id,
        amount: parseFloat(w.amount),
        method: w.method,
        status: w.status,
        utrNumber: w.utrNumber,
        createdAt: w.createdAt,
        approvedAt: w.approvedAt,
        rejectionReason: w.rejectionReason
      }))
    });
  } catch (error) {
    console.error('Withdrawal history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createWithdrawalRequest,
  getWithdrawalHistory
};
