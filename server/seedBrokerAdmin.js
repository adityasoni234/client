const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding broker admin data...');

  // Create Super Admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
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

  console.log('✅ Super Admin created:', superAdmin.email);
  console.log('📧 Email: admin@stockvala.com');
  console.log('🔑 Password: admin123');

  console.log('\n🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
