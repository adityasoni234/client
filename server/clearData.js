const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing all data...\n');

  try {
    // Delete in correct order (child tables first)
    await prisma.walletLedger.deleteMany({});
    console.log('✅ Cleared wallet ledger');
  } catch (e) {
    console.log('⚠️  walletLedger not found or already empty');
  }

  try {
    await prisma.kYCProfile.deleteMany({});
    console.log('✅ Cleared KYC profiles');
  } catch (e) {
    console.log('⚠️  KYCProfile not found or already empty');
  }

  try {
    await prisma.withdrawalRequest.deleteMany({});
    console.log('✅ Cleared withdrawal requests');
  } catch (e) {
    console.log('⚠️  withdrawalRequest not found or already empty');
  }

  try {
    await prisma.depositRequest.deleteMany({});
    console.log('✅ Cleared deposit requests');
  } catch (e) {
    console.log('⚠️  depositRequest not found or already empty');
  }

  try {
    await prisma.tradingAccount.deleteMany({});
    console.log('✅ Cleared trading accounts');
  } catch (e) {
    console.log('⚠️  tradingAccount not found or already empty');
  }

  try {
    await prisma.wallet.deleteMany({});
    console.log('✅ Cleared wallets');
  } catch (e) {
    console.log('⚠️  wallet not found or already empty');
  }

  try {
    await prisma.user.deleteMany({});
    console.log('✅ Cleared users');
  } catch (e) {
    console.log('⚠️  user not found or already empty');
  }

  console.log('\n🎉 All data cleared successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error clearing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
