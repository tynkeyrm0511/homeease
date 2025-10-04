const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
    // Delete all existing residents
    await prisma.user.deleteMany({ where: { role: 'resident' } });

    // Seed 10 new residents
    const residents = [];
    for (let i = 0; i < 10; i++) {
        residents.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            phone: faker.phone.number(),
            apartmentNumber: `A${faker.number.int({ min: 100, max: 999 })}`,
            gender: faker.person.sexType(),
            status: 'active',
            role: 'resident',
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            address: faker.location.streetAddress(),
            moveInDate: faker.date.past({ years: 5 }),
        });
    }
    await prisma.user.createMany({ data: residents });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());