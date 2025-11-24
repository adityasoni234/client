const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all KYC requests
const getAllKYC = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const [kycRequests, total] = await Promise.all([
      prisma.kycProfile.findMany({
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
              phone: true
            }
          }
        }
      }),
      prisma.kycProfile.count({ where })
    ]);

    res.json({
      success: true,
      data: kycRequests,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get KYC error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Approve KYC
const approveKYC = async (req, res) => {
  try {
    const { id } = req.params;

    const kyc = await prisma.kycProfile.update({
      where: { id },
      data: {
        status: 'APPROVED',
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'KYC approved successfully',
      data: kyc
    });
  } catch (error) {
    console.error('Approve KYC error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reject KYC
const rejectKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const kyc = await prisma.kycProfile.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        verifiedBy: req.user.id,
        verifiedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'KYC rejected',
      data: kyc
    });
  } catch (error) {
    console.error('Reject KYC error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllKYC,
  approveKYC,
  rejectKYC
};
