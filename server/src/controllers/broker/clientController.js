const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build where clause
    const where = {
      role: {
        in: ['CLIENT', 'MASTER', 'SUPER_MASTER']
      }
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }

    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Get clients
    const [clients, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          kycProfile: {
            select: {
              status: true
            }
          },
          wallet: {
            select: {
              availableBalance: true
            }
          },
          tradingAccounts: {
            select: {
              mt5Login: true,
              status: true
            },
            take: 1
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    // Format data
    const formattedClients = clients.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      role: client.role,
      status: client.status,
      kycStatus: client.kycProfile?.status || 'PENDING',
      balance: client.wallet?.availableBalance ? parseFloat(client.wallet.availableBalance) : 0,
      mt5Login: client.tradingAccounts[0]?.mt5Login || null,
      createdAt: client.createdAt
    }));

    res.json({
      success: true,
      data: formattedClients,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get client by ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.user.findUnique({
      where: { id },
      include: {
        kycProfile: true,
        wallet: true,
        tradingAccounts: true
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Block client
const blockClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.user.update({
      where: { id },
      data: {
        status: 'BLOCKED'
      }
    });

    res.json({
      success: true,
      message: 'Client blocked successfully',
      data: client
    });
  } catch (error) {
    console.error('Block client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Unblock client
const unblockClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await prisma.user.update({
      where: { id },
      data: {
        status: 'ACTIVE'
      }
    });

    res.json({
      success: true,
      message: 'Client unblocked successfully',
      data: client
    });
  } catch (error) {
    console.error('Unblock client error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllClients,
  getClientById,
  blockClient,
  unblockClient
};
