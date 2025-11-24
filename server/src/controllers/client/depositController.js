const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create deposit request
const createDepositRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, method, utrNumber } = req.body;
    const proofFile = req.file;

    if (!amount || parseFloat(amount) < 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Minimum deposit amount is ₹1,000' 
      });
    }

    if (!proofFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment proof is required' 
      });
    }

    // In production, upload to S3/Cloud Storage
    // For now, we'll store base64
    const proofUrl = `data:${proofFile.mimetype};base64,${proofFile.buffer.toString('base64')}`;

    const deposit = await prisma.depositRequest.create({
      data: {
        userId,
        amount: parseFloat(amount),
        currency: 'INR',
        method,
        utrNumber: utrNumber || null,
        proofUrl,
        status: 'PENDING'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Deposit request submitted successfully',
      data: deposit
    });
  } catch (error) {
    console.error('Create deposit error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get deposit history
const getDepositHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const deposits = await prisma.depositRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: deposits.map(d => ({
        id: d.id,
        amount: parseFloat(d.amount),
        method: d.method,
        status: d.status,
        createdAt: d.createdAt,
        approvedAt: d.approvedAt,
        rejectionReason: d.rejectionReason
      }))
    });
  } catch (error) {
    console.error('Deposit history error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createDepositRequest,
  getDepositHistory
};
