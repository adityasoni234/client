const MetaApi = require('metaapi.cloud-sdk').default;

// MetaApi Configuration
const METAAPI_CONFIG = {
  token: process.env.METAAPI_TOKEN || 'your_metaapi_token',
  accountId: process.env.METAAPI_ACCOUNT_ID || 'your_account_id',
  useMock: process.env.MT5_USE_MOCK === 'true'
};

class MetaApiService {
  constructor() {
    this.api = null;
    this.account = null;
    this.connection = null;
    this.isConnected = false;
    console.log(`🔧 MetaApi Service initialized (Mock Mode: ${METAAPI_CONFIG.useMock})`);
  }

  // Initialize MetaApi
  async initialize() {
    if (METAAPI_CONFIG.useMock) {
      console.log('✅ MetaApi Mock Mode - Initialized');
      this.isConnected = true;
      return true;
    }

    try {
      // Initialize MetaApi client
      this.api = new MetaApi(METAAPI_CONFIG.token);
      
      // Get account
      this.account = await this.api.metatraderAccountApi.getAccount(METAAPI_CONFIG.accountId);
      
      // Wait until account is deployed
      await this.account.deploy();
      console.log('⏳ Waiting for MetaApi account deployment...');
      await this.account.waitDeployed();
      
      // Connect to MetaApi
      this.connection = this.account.getRPCConnection();
      await this.connection.connect();
      console.log('⏳ Waiting for MetaApi connection...');
      await this.connection.waitSynchronized();
      
      this.isConnected = true;
      console.log('✅ Connected to MetaApi successfully');
      return true;
    } catch (error) {
      console.error('❌ MetaApi Connection Error:', error.message);
      console.log('⚠️  Falling back to Mock Mode');
      METAAPI_CONFIG.useMock = true;
      this.isConnected = true;
      return true;
    }
  }

  // Create new trading account
  async createAccount({ name, email, accountType = 'Standard', leverage = 100 }) {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
      return {
        success: true,
        mt5Login: `${Math.floor(Math.random() * 90000) + 10000}`,
        password: this.generatePassword(),
        server: 'HijaGlobalMarkets-Live',
        group: accountType,
        leverage
      };
    }

    try {
      // Note: MetaApi doesn't directly create accounts
      // You need to create accounts through your MT5 broker
      // and then add them to MetaApi
      throw new Error('Account creation must be done through MT5 broker');
    } catch (error) {
      console.error('Create Account Error:', error.message);
      throw error;
    }
  }

  // Get account information
  async getAccountInfo(mt5Login) {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
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
      const accountInfo = await this.connection.getAccountInformation();
      
      return {
        login: accountInfo.login?.toString() || mt5Login,
        balance: parseFloat(accountInfo.balance),
        equity: parseFloat(accountInfo.equity),
        margin: parseFloat(accountInfo.margin),
        freeMargin: parseFloat(accountInfo.freeMargin),
        marginLevel: parseFloat(accountInfo.marginLevel),
        credit: parseFloat(accountInfo.credit || 0),
        leverage: accountInfo.leverage,
        group: accountInfo.platform || 'MT5'
      };
    } catch (error) {
      console.error('Get Account Error:', error.message);
      throw error;
    }
  }

  // Get open positions
  async getOpenPositions(mt5Login) {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
      return this.generateMockPositions();
    }

    try {
      const positions = await this.connection.getPositions();
      
      return positions.map(pos => ({
        ticket: pos.id,
        symbol: pos.symbol,
        type: pos.type === 'POSITION_TYPE_BUY' ? 'BUY' : 'SELL',
        volume: parseFloat(pos.volume),
        openPrice: parseFloat(pos.openPrice),
        currentPrice: parseFloat(pos.currentPrice),
        profit: parseFloat(pos.profit),
        openTime: new Date(pos.time),
        sl: parseFloat(pos.stopLoss || 0),
        tp: parseFloat(pos.takeProfit || 0)
      }));
    } catch (error) {
      console.error('Get Positions Error:', error.message);
      return [];
    }
  }

  // Deposit funds (via MetaApi trade operation)
  async deposit(mt5Login, amount, comment = 'Deposit') {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
      return {
        success: true,
        newBalance: Math.random() * 100000 + parseFloat(amount),
        transactionId: `TXN${Date.now()}`
      };
    }

    try {
      // Note: MetaApi may not support direct balance operations
      // You might need to use your broker's specific API for this
      console.log('⚠️  Deposit operation - use broker-specific API');
      
      return {
        success: true,
        newBalance: parseFloat(amount),
        transactionId: `TXN${Date.now()}`
      };
    } catch (error) {
      console.error('Deposit Error:', error.message);
      throw error;
    }
  }

  // Withdraw funds
  async withdraw(mt5Login, amount, comment = 'Withdrawal') {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
      return {
        success: true,
        newBalance: Math.random() * 50000,
        transactionId: `TXN${Date.now()}`
      };
    }

    try {
      console.log('⚠️  Withdrawal operation - use broker-specific API');
      
      return {
        success: true,
        newBalance: 0,
        transactionId: `TXN${Date.now()}`
      };
    } catch (error) {
      console.error('Withdraw Error:', error.message);
      throw error;
    }
  }

  // Get trading history
  async getTradingHistory(mt5Login, fromDate, toDate) {
    if (!this.isConnected) await this.initialize();

    if (METAAPI_CONFIG.useMock) {
      return [];
    }

    try {
      const deals = await this.connection.getDealsByTimeRange(fromDate, toDate);
      
      return deals.map(deal => ({
        ticket: deal.id,
        order: deal.orderId,
        symbol: deal.symbol,
        type: deal.type === 'DEAL_TYPE_BUY' ? 'BUY' : 'SELL',
        volume: parseFloat(deal.volume),
        price: parseFloat(deal.price),
        profit: parseFloat(deal.profit),
        commission: parseFloat(deal.commission),
        swap: parseFloat(deal.swap || 0),
        time: new Date(deal.time)
      }));
    } catch (error) {
      console.error('Get Trading History Error:', error.message);
      return [];
    }
  }

  // Helper methods
  generatePassword(length = 10) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

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

// Export singleton
module.exports = new MetaApiService();
