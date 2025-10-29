const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');
    
    // Xóa dữ liệu cũ
    console.log('🗑️  Cleaning old data...');
    await prisma.notification.deleteMany({});
    await prisma.request.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.user.deleteMany({});

    // Tạo admin user
    console.log('👑 Creating admin user...');
    const adminPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
        data: {
            email: 'admin@homeease.com',
            password: adminPassword,
            name: 'Administrator',
            role: 'admin',
            phone: '0901234567',
            gender: 'male',
            dateOfBirth: new Date('1985-01-15'),
            address: 'Tòa nhà HomeEase, Quận 1, TP.HCM'
        }
    });

    // Tạo 100 cư dân giả với thông tin đầy đủ và realistic
    console.log('👥 Creating 100 residents...');
    const residents = [];
    const buildings = ['A', 'B', 'C', 'D', 'E']; // 5 tòa nhà
    const genders = ['male', 'female', 'other'];
    const statuses = ['active', 'inactive'];
    
    for (let i = 0; i < 100; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const gender = faker.helpers.arrayElement(genders);
        const building = faker.helpers.arrayElement(buildings);
        const floor = faker.number.int({ min: 1, max: 20 });
        const room = faker.number.int({ min: 1, max: 10 });
        
        residents.push({
            name: faker.person.fullName({ sex: gender === 'male' ? 'male' : 'female' }),
            email: faker.internet.email(),
            password: hashedPassword,
            role: 'resident',
            phone: `09${faker.number.int({ min: 10000000, max: 99999999 })}`,
            apartmentNumber: `${building}${floor}${room.toString().padStart(2, '0')}`,
            houseNumber: `${faker.number.int({ min: 1, max: 100 })}`,
            gender: gender,
            dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            address: `${building}-${floor}${room.toString().padStart(2, '0')}, Tòa ${building}, HomeEase Apartment`,
            moveInDate: faker.date.past({ years: 5 }),
            status: faker.helpers.arrayElement(statuses)
        });
    }
    await prisma.user.createMany({ data: residents });

    // Lấy danh sách id cư dân vừa tạo
    const residentIds = await prisma.user.findMany({
        where: { role: 'resident' },
        select: { id: true }
    });

    // Tạo 100 hóa đơn giả với dữ liệu realistic
    console.log('💰 Creating 100 invoices...');
    const invoices = [];
    const invoiceTypes = [
        { type: 'service', minAmount: 800, maxAmount: 1500 },
        { type: 'electricity', minAmount: 200, maxAmount: 800 },
        { type: 'water', minAmount: 50, maxAmount: 200 },
        { type: 'parking', minAmount: 300, maxAmount: 500 },
        { type: 'internet', minAmount: 200, maxAmount: 400 },
        { type: 'maintenance', minAmount: 100, maxAmount: 600 }
    ];

    for (let i = 0; i < 100; i++) {
        const resident = faker.helpers.arrayElement(residentIds);
        const invoiceType = faker.helpers.arrayElement(invoiceTypes);
        const isPaid = faker.datatype.boolean({ probability: 0.7 }); // 70% đã thanh toán
        const createdAt = faker.date.past({ years: 1 });
        
        invoices.push({
            amount: parseFloat(faker.finance.amount({ min: invoiceType.minAmount, max: invoiceType.maxAmount, dec: 0 })),
            dueDate: faker.date.future({ years: 0.5, refDate: createdAt }),
            isPaid: isPaid,
            paidAt: isPaid ? faker.date.between({ from: createdAt, to: new Date() }) : null,
            type: invoiceType.type,
            createdAt: createdAt,
            userId: resident.id,
            paymentStatus: isPaid ? 'completed' : faker.helpers.arrayElement(['pending', 'processing']),
            paymentTransactionId: isPaid ? `TXN${faker.string.alphanumeric(16).toUpperCase()}` : null
        });
    }
    await prisma.invoice.createMany({ data: invoices });

    // Tạo 100 yêu cầu bảo trì/dịch vụ giả với mô tả tiếng Việt
    console.log('🔧 Creating 100 service requests...');
    const requests = [];
    const requestTemplates = [
        { category: 'electricity', descriptions: ['Đèn hành lang tầng {floor} bị hỏng', 'Mất điện phòng {room}', 'Công tắc điện bị chập', 'Cần thay bóng đèn phòng khách'] },
        { category: 'water', descriptions: ['Vòi nước nhà vệ sinh bị rò rỉ', 'Áp lực nước yếu', 'Đường ống nước bị tắc', 'Bồn cầu bị hỏng cần sửa chữa'] },
        { category: 'cleaning', descriptions: ['Cần vệ sinh hành lang tầng {floor}', 'Thang máy cần lau dọn', 'Sân chơi cần dọn dẹp', 'Bãi đỗ xe cần quét dọn'] },
        { category: 'security', descriptions: ['Camera an ninh bị mờ', 'Cần kiểm tra hệ thống báo động', 'Thẻ từ không hoạt động', 'Đèn an ninh ban đêm bị hỏng'] },
        { category: 'elevator', descriptions: ['Thang máy tòa {building} bị kẹt', 'Nút bấm thang máy không hoạt động', 'Thang máy kêu ồn bất thường', 'Cửa thang máy đóng mở chậm'] },
        { category: 'other', descriptions: ['Cần sửa cửa ra vào chung cư', 'Hệ thống phòng cháy cần kiểm tra', 'Cần bổ sung thùng rác tầng {floor}', 'Sân chơi trẻ em cần bảo dưỡng'] }
    ];

    for (let i = 0; i < 100; i++) {
        const resident = faker.helpers.arrayElement(residentIds);
        const template = faker.helpers.arrayElement(requestTemplates);
        const description = faker.helpers.arrayElement(template.descriptions)
            .replace('{floor}', faker.number.int({ min: 1, max: 20 }))
            .replace('{room}', faker.number.int({ min: 1, max: 10 }))
            .replace('{building}', faker.helpers.arrayElement(buildings));
        
        const createdAt = faker.date.past({ years: 1 });
        const status = faker.helpers.arrayElement(['pending', 'in_progress', 'completed', 'rejected', 'cancelled']);
        
        requests.push({
            description: description,
            status: status,
            category: template.category,
            priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
            createdAt: createdAt,
            updatedAt: status === 'pending' ? createdAt : faker.date.between({ from: createdAt, to: new Date() }),
            userId: resident.id
        });
    }
    await prisma.request.createMany({ data: requests });

    // Tạo 100 thông báo giả với nội dung tiếng Việt realistic
    console.log('📢 Creating 100 notifications...');
    const notifications = [];
    const notificationTemplates = [
        { title: 'Thông báo bảo trì hệ thống điện', content: 'Ban quản lý thông báo sẽ tiến hành bảo trì hệ thống điện vào ngày {date}. Vui lòng chuẩn bị trước.', target: 'all' },
        { title: 'Thông báo cắt nước', content: 'Tạm ngưng cung cấp nước từ {time} để sửa chữa đường ống. Quý cư dân vui lòng dự trữ nước.', target: 'all' },
        { title: 'Thông báo họp cư dân', content: 'Cuộc họp cư dân định kỳ sẽ được tổ chức vào {date}. Mọi người vui lòng tham dự.', target: 'all' },
        { title: 'Nhắc nhở thanh toán hóa đơn', content: 'Quý cư dân vui lòng thanh toán hóa đơn tháng {month} trước ngày {date} để tránh phát sinh phí trễ hạn.', target: 'residentId' },
        { title: 'Thông báo nâng cấp thang máy', content: 'Thang máy tòa {building} sẽ được nâng cấp từ {date}. Thời gian dự kiến: 3 ngày.', target: 'group' },
        { title: 'Thông báo vệ sinh định kỳ', content: 'Vệ sinh hành lang và khu vực chung sẽ được thực hiện vào sáng {date}.', target: 'all' },
        { title: 'Chúc mừng năm mới', content: 'Ban quản lý xin chúc toàn thể cư dân một năm mới an khang thịnh vượng!', target: 'all' },
        { title: 'Thông báo kiểm tra PCCC', content: 'Hệ thống phòng cháy chữa cháy sẽ được kiểm tra định kỳ vào {date}. Xin lưu ý.', target: 'all' },
        { title: 'Thông báo sự kiện cộng đồng', content: 'Tổ chức hoạt động văn nghệ cộng đồng vào {date} tại sảnh tòa nhà. Mời toàn thể cư dân tham gia.', target: 'all' },
        { title: 'Thông báo bảo mật', content: 'Vui lòng không chia sẻ thẻ từ và mật khẩu cho người lạ để đảm bảo an ninh chung cư.', target: 'all' }
    ];

    for (let i = 0; i < 100; i++) {
        const template = faker.helpers.arrayElement(notificationTemplates);
        const targetType = template.target;
        let userId = null;
        
        if (targetType === 'residentId') {
            const resident = faker.helpers.arrayElement(residentIds);
            userId = resident.id;
        }
        
        const content = template.content
            .replace('{date}', faker.date.future({ years: 0.2 }).toLocaleDateString('vi-VN'))
            .replace('{time}', `${faker.number.int({ min: 8, max: 17 })}:00`)
            .replace('{month}', faker.number.int({ min: 1, max: 12 }))
            .replace('{building}', faker.helpers.arrayElement(buildings));
        
        notifications.push({
            title: template.title,
            content: content,
            createdAt: faker.date.past({ years: 0.5 }),
            userId: userId,
            target: targetType
        });
    }
    await prisma.notification.createMany({ data: notifications });

    console.log('✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SEED SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin: 1');
    console.log('👥 Residents: 100');
    console.log('💰 Invoices: 100');
    console.log('🔧 Requests: 100');
    console.log('📢 Notifications: 100');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 LOGIN CREDENTIALS:');
    console.log('   Admin: admin@homeease.com / password123');
    console.log('   All residents: <email> / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());