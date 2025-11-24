const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mt5Service = require('../../services/mt5Service');

const prisma = new PrismaClient();

// Login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { 
        tradingAccounts: { take: 1 },
        wallet: true
      }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'Account is not active' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mt5Login: user.tradingAccounts[0]?.mt5Login || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Register
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        role: 'CLIENT',
        status: 'ACTIVE'
      }
    });

    // Create MT5 account
    try {
      const mt5Account = await mt5Service.createAccount({
        name,
        email,
        accountType: 'Standard',
        leverage: 100
      });

      // Save MT5 account to database
      await prisma.tradingAccount.create({
        data: {
          userId: user.id,
          mt5Login: mt5Account.mt5Login,
          server: mt5Account.server,
          groupName: mt5Account.group,
          leverage: mt5Account.leverage,
          balance: 0,
          equity: 0,
          status: 'ACTIVE'
        }
      });

      // Create wallet
      await prisma.wallet.create({
        data: {
          userId: user.id,
          currency: 'INR',
          availableBalance: 0,
          lockedBalance: 0
        }
      });

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        mt5Login: mt5Account.mt5Login,
        password: mt5Account.password
      });
    } catch (mt5Error) {
      console.error('MT5 creation error:', mt5Error);
      // Delete user if MT5 creation fails
      await prisma.user.delete({ where: { id: user.id } });
      throw new Error('Failed to create trading account');
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};

module.exports = { login, register };
