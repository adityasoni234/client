import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stockvala.com' },
    update: {},
    create: {
      email: 'admin@stockvala.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      phone: '+91 9876543210'
    }
  });

  console.log('✅ Created Super Admin:', admin.email);

  // Create wallet for admin
  const adminWallet = await prisma.wallet.upsert({
    where: {
      userId_currency: {
        userId: admin.id,
        currency: 'INR'
      }
    },
    update: {},
    create: {
      userId: admin.id,
      currency: 'INR',
      availableBalance: 0,
      lockedBalance: 0
    }
  });

  console.log('✅ Created admin wallet');

  // Create a test client
  const clientPassword = await bcrypt.hash('client123', 10);
  
  const client = await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {},
    create: {
      email: 'client@example.com',
      password: clientPassword,
      name: 'Test Client',
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '+91 9876543211'
    }
  });

  console.log('✅ Created Test Client:', client.email);

  // Create wallet for client
  await prisma.wallet.upsert({
    where: {
      userId_currency: {
        userId: client.id,
        currency: 'INR'
      }
    },
    update: {},
    create: {
      userId: client.id,
      currency: 'INR',
      availableBalance: 5000, // Give test client 5000 INR
      lockedBalance: 0
    }
  });

  console.log('✅ Created client wallet with ₹5000');

  // Create KYC profile for client
  await prisma.kYCProfile.upsert({
    where: { userId: client.id },
    update: {},
    create: {
      userId: client.id,
      status: 'PENDING'
    }
  });

  console.log('✅ Created KYC profile');

  // Create a test Master (IB)
  const masterPassword = await bcrypt.hash('master123', 10);
  
  const master = await prisma.user.upsert({
    where: { email: 'master@example.com' },
    update: {},
    create: {
      email: 'master@example.com',
      password: masterPassword,
      name: 'Test Master',
      role: 'MASTER',
      status: 'ACTIVE',
      phone: '+91 9876543212'
    }
  });

  console.log('✅ Created Test Master:', master.email);

  // Create wallet for master
  await prisma.wallet.upsert({
    where: {
      userId_currency: {
        userId: master.id,
        currency: 'INR'
      }
    },
    update: {},
    create: {
      userId: master.id,
      currency: 'INR',
      availableBalance: 0,
      lockedBalance: 0
    }
  });

  console.log('✅ Created master wallet');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📧 Login Credentials:');
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│  Super Admin (Broker Owner)                 │');
  console.log('│  Email: admin@stockvala.com                 │');
  console.log('│  Password: admin123                         │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│  Test Client                                │');
  console.log('│  Email: client@example.com                  │');
  console.log('│  Password: client123                        │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│  Test Master (IB)                           │');
  console.log('│  Email: master@example.com                  │');
  console.log('│  Password: master123                        │');
  console.log('└─────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });