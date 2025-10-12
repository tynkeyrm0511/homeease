// Script: Re-hash admin password in DB
const prisma = require('../prismaClient.js');
const bcrypt = require('bcryptjs');

async function rehashAdminPassword() {
  const email = 'admin@homeease.com';
  const newPlainPassword = 'password123'; // Đổi nếu cần
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPlainPassword, salt);

  const updated = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });
  console.log('Admin password re-hashed:', updated);
  await prisma.$disconnect();
}

rehashAdminPassword().catch(console.error);
