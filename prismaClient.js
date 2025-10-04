const { PrismaClient } = require('@prisma/client');

//Initialize prisma client
const prisma = new PrismaClient();

module.exports = prisma;