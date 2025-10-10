const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // Xóa dữ liệu cũ
    await prisma.notification.deleteMany({});
    await prisma.request.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.user.deleteMany({});

    // Tạo admin user
    const adminPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@homeease.com',
            password: adminPassword,
            name: 'Administrator',
            role: 'admin'
        }
    });

    // Tạo 10 cư dân giả
    const residents = [];
    for (let i = 0; i < 10; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        residents.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: hashedPassword,
            role: 'resident'
            // Chỉ tạo fields có trong User model
            // Nếu cần thêm fields khác, update schema trước
        });
    }
    await prisma.user.createMany({ data: residents });

    // Lấy danh sách id cư dân vừa tạo
    const residentIds = await prisma.user.findMany({
        where: { role: 'resident' },
        select: { id: true }
    });

    // Tạo 10 hóa đơn giả
    const invoices = [];
    for (let i = 0; i < 10; i++) {
        const resident = faker.helpers.arrayElement(residentIds);
        invoices.push({
            amount: parseFloat(faker.finance.amount(500, 2000, 2)),
            dueDate: faker.date.future({ years: 1 }),
            isPaid: faker.datatype.boolean(),
            type: faker.helpers.arrayElement(['service', 'electricity', 'water', 'parking']),
            userId: resident.id
        });
    }
    await prisma.invoice.createMany({ data: invoices });

    // Tạo 10 yêu cầu bảo trì giả
    const requests = [];
    for (let i = 0; i < 10; i++) {
        const resident = faker.helpers.arrayElement(residentIds);
        requests.push({
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'rejected']),
            category: faker.helpers.arrayElement(['electricity', 'water', 'cleaning', 'other']),
            priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
            userId: resident.id
        });
    }
    await prisma.request.createMany({ data: requests });

    // Tạo 10 thông báo giả
    const notifications = [];
    for (let i = 0; i < 10; i++) {
        const resident = faker.helpers.arrayElement(residentIds);
        notifications.push({
            title: faker.lorem.words(5),
            content: faker.lorem.sentences(2),
            userId: resident.id,
            target: faker.helpers.arrayElement(['all', 'group', 'residentId'])
        });
    }
    await prisma.notification.createMany({ data: notifications });

    console.log('Database seeded successfully!');
    console.log('Admin login: admin@homeease.com / password123');
    console.log('All residents use password: password123');
    console.log(`Created ${residents.length} residents, ${invoices.length} invoices, ${requests.length} requests, ${notifications.length} notifications`);
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());