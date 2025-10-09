const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
    // Xóa dữ liệu cũ
    await prisma.notification.deleteMany({});
    await prisma.request.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.user.deleteMany({});

    // Tạo 10 cư dân giả
    const residents = [];
    for (let i = 0; i < 10; i++) {
        residents.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'resident',
            phone: faker.phone.number(),
            apartmentNumber: `A${faker.number.int({ min: 100, max: 999 })}`,
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            gender: faker.person.sexType(),
            address: faker.location.streetAddress(),
            moveInDate: faker.date.past({ years: 5 }),
            status: 'active'
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
            createdAt: faker.date.recent({ days: 30 }),
            paidAt: faker.datatype.boolean() ? faker.date.recent({ days: 10 }) : null,
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
            createdAt: faker.date.recent({ days: 30 }),
            updatedAt: faker.date.recent({ days: 5 }),
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
            createdAt: faker.date.recent({ days: 30 }),
            userId: resident.id,
            target: faker.helpers.arrayElement(['all', 'group', 'residentId'])
        });
    }
    await prisma.notification.createMany({ data: notifications });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());