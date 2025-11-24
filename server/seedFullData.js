const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding comprehensive data...\n');

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  // 1. Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@stockvala.com' },
    update: {},
    create: {
      email: 'admin@stockvala.com',
      name: 'Super Admin',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE'
    }
  });
  console.log('✅ Super Admin created');

  // 2. Create IBs
  const superMaster1 = await prisma.user.create({
    data: {
      email: 'supermaster1@example.com',
      name: 'Super Master IB 1',
      password: hashedPassword,
      phone: '+919876543211',
      role: 'SUPER_MASTER',
      status: 'ACTIVE'
    }
  });

  const master1 = await prisma.user.create({
    data: {
      email: 'master1@example.com',
      name: 'Master IB 1',
      password: hashedPassword,
      phone: '+919876543212',
      role: 'MASTER',
      parentId: superMaster1.id,
      status: 'ACTIVE'
    }
  });

  const master2 = await prisma.user.create({
    data: {
      email: 'master2@example.com',
      name: 'Master IB 2',
      password: hashedPassword,
      phone: '+919876543213',
      role: 'MASTER',
      status: 'ACTIVE'
    }
  });
  console.log('✅ IBs created (1 Super Master, 2 Masters)');

  // 3. Create Clients
  const clients = [];
  for (let i = 1; i <= 20; i++) {
    const client = await prisma.user.create({
      data: {
        email: `client${i}@example.com`,
        name: `Client ${i}`,
        password: hashedPassword,
        phone: `+91${9000000000 + i}`,
        role: 'CLIENT',
        parentId: i <= 10 ? master1.id : master2.id,
        status: 'ACTIVE'
      }
    });
    clients.push(client);

    // Create wallet
    await prisma.wallet.create({
      data: {
        userId: client.id,
        currency: 'INR',
        availableBalance: Math.floor(Math.random() * 100000),
        lockedBalance: Math.floor(Math.random() * 10000)
      }
    });

    // Create trading account
    await prisma.tradingAccount.create({
      data: {
        userId: client.id,
        mt5Login: `${90000 + i}`,
        mt5Server: 'HijaGlobalMarkets-Live',
        groupName: 'Standard',
        leverage: 100,
        balance: Math.floor(Math.random() * 100000),
        equity: Math.floor(Math.random() * 110000),
        status: 'ACTIVE'
      }
    });
  }
  console.log(`✅ ${clients.length} clients created with wallets and MT5 accounts`);

  // 4. Create Deposits (matching schema exactly)
  for (let i = 0; i < 10; i++) {
    await prisma.depositRequest.create({
      data: {
        userId: clients[i].id,
        amount: Math.floor(Math.random() * 50000) + 5000,
        currency: 'INR',
        paymentProofUrl: 'https://example.com/payment-proof.jpg',
        utrNumber: `UTR${100000 + i}`,
        status: i < 3 ? 'PENDING' : i < 7 ? 'APPROVED' : 'REJECTED',
        approvedBy: i >= 3 ? superAdmin.id : null,
        approvedAt: i >= 3 ? new Date() : null
      }
    });
  }
  console.log('✅ 10 deposit requests created');

  // 5. Create Withdrawals (matching schema exactly)
  for (let i = 0; i < 8; i++) {
    await prisma.withdrawalRequest.create({
      data: {
        userId: clients[i + 5].id,
        amount: Math.floor(Math.random() * 30000) + 2000,
        currency: 'INR',
        accountNumber: `123456789${i}`,
        ifscCode: `HDFC000${i}`,
        status: i < 2 ? 'PENDING' : i < 5 ? 'APPROVED' : 'REJECTED',
        approvedBy: i >= 2 ? superAdmin.id : null,
        approvedAt: i >= 2 ? new Date() : null
      }
    });
  }
  console.log('✅ 8 withdrawal requests created');

  // 6. Create KYC Profiles (matching schema exactly)
  for (let i = 0; i < 15; i++) {
    await prisma.kYCProfile.create({
      data: {
        userId: clients[i].id,
        panNumber: `ABCDE1234${String(i)}`,
        panDocUrl: 'https://example.com/pan.jpg',
        aadhaarNumber: `123456789${String(100 + i)}`,
        aadhaarDocUrl: 'https://example.com/aadhaar.jpg',
        selfieUrl: 'https://example.com/selfie.jpg',
        addressProofUrl: 'https://example.com/address.jpg',
        status: i < 5 ? 'PENDING' : i < 12 ? 'APPROVED' : 'REJECTED',
        remarks: i >= 12 ? 'Documents not clear' : null,
        verifiedBy: i >= 5 ? superAdmin.id : null,
        verifiedAt: i >= 5 ? new Date() : null
      }
    });
  }
  console.log('✅ 15 KYC profiles created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log('   • Total Users: 24');
  console.log('     - 1 Super Admin');
  console.log('     - 1 Super Master IB');
  console.log('     - 2 Master IBs');
  console.log('     - 20 Clients');
  console.log('   • Deposits: 10 (3 Pending, 4 Approved, 3 Rejected)');
  console.log('   • Withdrawals: 8 (2 Pending, 3 Approved, 3 Rejected)');
  console.log('   • KYC: 15 (5 Pending, 7 Approved, 3 Rejected)');
  console.log('\n🔐 Login Credentials:');
  console.log('   Email: admin@stockvala.com');
  console.log('   Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
