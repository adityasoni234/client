const axios = require('axios');

// MT5 Manager API Configuration
const MT5_CONFIG = {
  apiUrl: process.env.MT5_API_URL || 'https://your-mt5-server.com/api',
  managerLogin: process.env.MT5_MANAGER_LOGIN || '1000',
  managerPassword: process.env.MT5_MANAGER_PASSWORD || 'manager_password',
  useMock: process.env.MT5_USE_MOCK === 'true',
  timeout: 30000
};

class MT5Service {
  constructor() {
    this.isConnected = false;
    this.sessionToken = null;
    console.log(`🔧 MT5 Service initialized (Mock Mode: ${MT5_CONFIG.useMock})`);
  }

  // Connect to MT5 Manager API
  async connect() {
    if (MT5_CONFIG.useMock) {
      this.isConnected = true;
      console.log('✅ MT5 Mock Mode - Connected');
      return true;
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/auth/login`, {
        login: MT5_CONFIG.managerLogin,
        password: MT5_CONFIG.managerPassword
      }, {
        timeout: MT5_CONFIG.timeout,
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.retcode === 0 || response.data.success) {
        this.isConnected = true;
        this.sessionToken = response.data.token || response.data.session;
        console.log('✅ Connected to MT5 Manager API');
        return true;
      }
      
      throw new Error('Authentication failed');
    } catch (error) {
      console.error('❌ MT5 Connection Error:', error.message);
      console.log('⚠️  Falling back to Mock Mode');
      MT5_CONFIG.useMock = true;
      this.isConnected = true;
      return true;
    }
  }

  // Get API headers
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.sessionToken}`
    };
  }

  // Create new trading account
  async createAccount({ name, email, accountType = 'Standard', leverage = 100 }) {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return {
        success: true,
        mt5Login: `${Math.floor(Math.random() * 90000) + 10000}`,
        password: this.generatePassword(),
        server: 'HijaGlobalMarkets-Demo',
        group: accountType,
        leverage
      };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/user/add`, {
        name,
        email,
        group: accountType,
        leverage,
        balance: 0,
        currency: 'USD',
        enable: 1,
        enable_change_password: 1
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0) {
        return {
          success: true,
          mt5Login: response.data.answer.login.toString(),
          password: response.data.answer.password,
          server: response.data.answer.server,
          group: accountType,
          leverage
        };
      }

      throw new Error(response.data.error || 'Failed to create account');
    } catch (error) {
      console.error('Create Account Error:', error.message);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo(mt5Login) {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      const balance = 50000 + Math.random() * 50000;
      const equity = balance + (Math.random() - 0.5) * 10000;
      const margin = Math.random() * 5000;
      
      return {
        login: mt5Login,
        balance: parseFloat(balance.toFixed(2)),
        equity: parseFloat(equity.toFixed(2)),
        margin: parseFloat(margin.toFixed(2)),
        freeMargin: parseFloat((equity - margin).toFixed(2)),
        marginLevel: margin > 0 ? parseFloat(((equity / margin) * 100).toFixed(2)) : 0,
        credit: 0,
        leverage: 100,
        group: 'Standard'
      };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/user/get`, {
        login: parseInt(mt5Login)
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0) {
        const account = response.data.answer;
        return {
          login: account.login.toString(),
          balance: parseFloat(account.balance),
          equity: parseFloat(account.equity),
          margin: parseFloat(account.margin),
          freeMargin: parseFloat(account.margin_free),
          marginLevel: parseFloat(account.margin_level),
          credit: parseFloat(account.credit || 0),
          leverage: account.leverage,
          group: account.group
        };
      }

      throw new Error('Account not found');
    } catch (error) {
      console.error('Get Account Error:', error.message);
      throw error;
    }
  }

  // Get open positions
  async getOpenPositions(mt5Login) {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return this.generateMockPositions();
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/position/get`, {
        login: parseInt(mt5Login)
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0 && response.data.answer) {
        return response.data.answer.map(pos => ({
          ticket: pos.position,
          symbol: pos.symbol,
          type: pos.action === 0 ? 'BUY' : 'SELL',
          volume: parseFloat(pos.volume / 10000),
          openPrice: parseFloat(pos.price_open),
          currentPrice: parseFloat(pos.price_current),
          profit: parseFloat(pos.profit),
          openTime: new Date(pos.time * 1000),
          sl: parseFloat(pos.price_sl || 0),
          tp: parseFloat(pos.price_tp || 0)
        }));
      }

      return [];
    } catch (error) {
      console.error('Get Positions Error:', error.message);
      return [];
    }
  }

  // Deposit funds
  async deposit(mt5Login, amount, comment = 'Deposit') {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return {
        success: true,
        newBalance: Math.random() * 100000 + parseFloat(amount),
        transactionId: `TXN${Date.now()}`
      };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/trade/balance`, {
        login: parseInt(mt5Login),
        type: 2, // Balance operation
        balance: parseFloat(amount),
        comment
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0) {
        return {
          success: true,
          newBalance: parseFloat(response.data.answer.balance),
          transactionId: response.data.answer.deal?.toString() || `TXN${Date.now()}`
        };
      }

      throw new Error(response.data.error || 'Deposit failed');
    } catch (error) {
      console.error('Deposit Error:', error.message);
      throw error;
    }
  }

  // Withdraw funds
  async withdraw(mt5Login, amount, comment = 'Withdrawal') {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return {
        success: true,
        newBalance: Math.random() * 50000,
        transactionId: `TXN${Date.now()}`
      };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/trade/balance`, {
        login: parseInt(mt5Login),
        type: 2,
        balance: -parseFloat(amount), // Negative for withdrawal
        comment
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0) {
        return {
          success: true,
          newBalance: parseFloat(response.data.answer.balance),
          transactionId: response.data.answer.deal?.toString() || `TXN${Date.now()}`
        };
      }

      throw new Error(response.data.error || 'Withdrawal failed');
    } catch (error) {
      console.error('Withdraw Error:', error.message);
      throw error;
    }
  }

  // Change leverage
  async changeLeverage(mt5Login, newLeverage) {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return { success: true };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/user/update`, {
        login: parseInt(mt5Login),
        leverage: parseInt(newLeverage)
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      return { success: response.data.retcode === 0 };
    } catch (error) {
      console.error('Change Leverage Error:', error.message);
      throw error;
    }
  }

  // Reset password
  async resetPassword(mt5Login) {
    if (!this.isConnected) await this.connect();

    const newPassword = this.generatePassword();

    if (MT5_CONFIG.useMock) {
      return {
        success: true,
        newPassword
      };
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/user/update`, {
        login: parseInt(mt5Login),
        password: newPassword,
        change_password_invest: 1
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0) {
        return {
          success: true,
          newPassword
        };
      }

      throw new Error('Failed to reset password');
    } catch (error) {
      console.error('Reset Password Error:', error.message);
      throw error;
    }
  }

  // Get trading history
  async getTradingHistory(mt5Login, fromDate, toDate) {
    if (!this.isConnected) await this.connect();

    if (MT5_CONFIG.useMock) {
      return [];
    }

    try {
      const response = await axios.post(`${MT5_CONFIG.apiUrl}/deal/get`, {
        login: parseInt(mt5Login),
        from: Math.floor(fromDate.getTime() / 1000),
        to: Math.floor(toDate.getTime() / 1000)
      }, {
        headers: this.getHeaders(),
        timeout: MT5_CONFIG.timeout
      });

      if (response.data.retcode === 0 && response.data.answer) {
        return response.data.answer.map(deal => ({
          ticket: deal.deal,
          order: deal.order,
          symbol: deal.symbol,
          type: deal.action === 0 ? 'BUY' : 'SELL',
          volume: parseFloat(deal.volume / 10000),
          price: parseFloat(deal.price),
          profit: parseFloat(deal.profit),
          commission: parseFloat(deal.commission),
          swap: parseFloat(deal.storage),
          time: new Date(deal.time * 1000)
        }));
      }

      return [];
    } catch (error) {
      console.error('Get Trading History Error:', error.message);
      return [];
    }
  }

  // Helper: Generate random password
  generatePassword(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Helper: Generate mock positions
  generateMockPositions() {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'BTCUSD'];
    const positions = [];
    
    const numPositions = Math.floor(Math.random() * 5);
    
    for (let i = 0; i < numPositions; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const type = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const openPrice = 1.1 + Math.random() * 0.1;
      const currentPrice = openPrice + (Math.random() - 0.5) * 0.02;
      const volume = parseFloat((Math.random() * 2).toFixed(2));
      
      positions.push({
        ticket: Math.floor(Math.random() * 9000000) + 1000000,
        symbol,
        type,
        volume,
        openPrice: parseFloat(openPrice.toFixed(5)),
        currentPrice: parseFloat(currentPrice.toFixed(5)),
        profit: parseFloat(((currentPrice - openPrice) * volume * 100000 * (type === 'BUY' ? 1 : -1)).toFixed(2)),
        openTime: new Date(Date.now() - Math.random() * 86400000),
        sl: 0,
        tp: 0
      });
    }
    
    return positions;
  }
}

// Export singleton instance
module.exports = new MT5Service();
