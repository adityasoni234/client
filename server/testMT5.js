const mt5Service = require('./src/services/mt5Service');

async function testMT5() {
  console.log('\n🧪 Testing MT5 Service...\n');

  try {
    // Test 1: Connect
    console.log('1️⃣ Testing Connection...');
    await mt5Service.connect();
    console.log('✅ Connected\n');

    // Test 2: Create Account
    console.log('2️⃣ Testing Create Account...');
    const newAccount = await mt5Service.createAccount({
      name: 'Test User',
      email: 'test@example.com',
      accountType: 'Standard',
      leverage: 100
    });
    console.log('✅ Account Created:', newAccount);
    console.log(`   MT5 Login: ${newAccount.mt5Login}`);
    console.log(`   Password: ${newAccount.password}\n`);

    // Test 3: Get Account Info
    console.log('3️⃣ Testing Get Account Info...');
    const accountInfo = await mt5Service.getAccountInfo(newAccount.mt5Login);
    console.log('✅ Account Info:', {
      login: accountInfo.login,
      balance: `$${accountInfo.balance.toLocaleString()}`,
      equity: `$${accountInfo.equity.toLocaleString()}`,
      freeMargin: `$${accountInfo.freeMargin.toLocaleString()}`,
      marginLevel: `${accountInfo.marginLevel}%`
    });
    console.log('');

    // Test 4: Get Open Positions
    console.log('4️⃣ Testing Get Open Positions...');
    const positions = await mt5Service.getOpenPositions(newAccount.mt5Login);
    console.log(`✅ Found ${positions.length} open positions:`);
    positions.forEach(pos => {
      console.log(`   ${pos.symbol} ${pos.type} ${pos.volume} lots @ ${pos.openPrice} | P/L: $${pos.profit}`);
    });
    console.log('');

    // Test 5: Deposit
    console.log('5️⃣ Testing Deposit...');
    const depositResult = await mt5Service.deposit(newAccount.mt5Login, 5000, 'Test Deposit');
    console.log('✅ Deposit Successful:', {
      amount: '$5,000',
      newBalance: `$${depositResult.newBalance.toLocaleString()}`,
      transactionId: depositResult.transactionId
    });
    console.log('');

    // Test 6: Withdraw
    console.log('6️⃣ Testing Withdraw...');
    const withdrawResult = await mt5Service.withdraw(newAccount.mt5Login, 1000, 'Test Withdrawal');
    console.log('✅ Withdrawal Successful:', {
      amount: '$1,000',
      newBalance: `$${withdrawResult.newBalance.toLocaleString()}`,
      transactionId: withdrawResult.transactionId
    });
    console.log('');

    // Test 7: Change Leverage
    console.log('7️⃣ Testing Change Leverage...');
    const leverageResult = await mt5Service.changeLeverage(newAccount.mt5Login, 200);
    console.log('✅ Leverage Changed to 1:200\n');

    // Test 8: Reset Password
    console.log('8️⃣ Testing Reset Password...');
    const resetResult = await mt5Service.resetPassword(newAccount.mt5Login);
    console.log('✅ Password Reset:', {
      newPassword: resetResult.newPassword
    });
    console.log('');

    console.log('🎉 All tests passed!\n');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMT5();
