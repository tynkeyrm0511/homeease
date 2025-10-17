const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const { residentSchema } = require('../utils/validators')
//Get all residents - GET
const getResidents = async (req,res) => {
    try{
        const residents = await prisma.user.findMany({
            where: {
                role: {
                    in: ['resident', 'admin']
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                apartmentNumber: true,
                houseNumber: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                moveInDate: true,
                status: true,
                role: true
            }
        });
        res.json(residents)
    }catch(err){
        res.status(500).json({error: 'Failed to fetch residents'})
    }
};
//Get resident detail - GET
const getResidentDetail = async (req,res) => {
    try{
        const { id } = req.params;
        const resident = await prisma.user.findUnique({
            where: {id: Number(id)}
        });
        if(!resident){
            return res.status(404).json({error: 'Resident not found!'});
        }
        res.json(resident);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Failed to get resident detail`})
    }
}

//Add a new resident - POST
const addResident = async (req, res) => {
    try{
        //Validate request body
        const { error } = residentSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                error: error.details[0].message
            })
        };
        
        const { 
            name, 
            email, 
            password, 
            phone, 
            apartmentNumber, 
            dateOfBirth, 
            gender, 
            address, 
            moveInDate, 
            status 
        } = req.body;

        // Mã hóa mật khẩu khi tạo mới
        let hashedPassword = '';
        if (typeof password === 'string' && password.length >= 6) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        } else {
            return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự!' });
        }

        //Conver date strings to JS Date objects
        const dob = dateOfBirth ? new Date(dateOfBirth) : null;
        const moveIn = moveInDate ? new Date(moveInDate) : null;
        const newResident = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                apartmentNumber,
                dateOfBirth: dob,
                gender,
                address,
                moveInDate: moveIn,
                status,
                role: req.body.role || 'resident'
            }
        });
        res.status(201).json({newResident});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to add a new resident'})
    }
}

//Update resident - PUT/PATCH
const updateResident = async (req,res) => {
    try{
        const { id } = req.params;
        const {
            name,
            email,
            password,
            phone,
            apartmentNumber,
            dateOfBirth,
            gender,
            address,
            moveInDate,
            status,
            role
        } = req.body;

        //Convert date strings to JS Date objects
        const dob = dateOfBirth ? new Date(dateOfBirth) : null;
        const moveIn = moveInDate ? new Date(moveInDate) : null;

        const updateData = {
            name,
            email,
            phone,
            apartmentNumber,
            dateOfBirth: dob,
            gender,
            address,
            moveInDate: moveIn,
            status
        };
        // Nếu password truyền lên là chuỗi >= 6 thì mã hóa và cập nhật, nếu để trống thì giữ nguyên
        if (typeof password === 'string' && password.length >= 6) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateData.password = hashedPassword;
        }
        // Nếu password là chuỗi rỗng hoặc không truyền thì không cập nhật password (giữ nguyên)
        if (role) {
            updateData.role = role;
        }

        const updatedResident = await prisma.user.update({
            where: {id: Number(id)},
            data: updateData
        });
        res.json(updatedResident);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to update resident'})
    }
}

//Delete resident - DELETE
const deleteResident = async (req,res) => {
    try {
        const { id } = req.params;
        // Đếm số lượng liên quan
        const invoiceCount = await prisma.invoice.count({ where: { userId: Number(id) } });
        const requestCount = await prisma.request.count({ where: { userId: Number(id) } });
        const notificationCount = await prisma.notification.count({ where: { userId: Number(id) } });

        // Xóa invoice liên quan
        const deletedInvoices = await prisma.invoice.deleteMany({ where: { userId: Number(id) } });
        // Xóa request liên quan
        const deletedRequests = await prisma.request.deleteMany({ where: { userId: Number(id) } });
        // Xóa notification liên quan
        const deletedNotifications = await prisma.notification.deleteMany({ where: { userId: Number(id) } });
        // Xóa user
        await prisma.user.delete({ where: { id: Number(id) } });
        res.json({ 
            message: 'Resident deleted successfully!', 
            deletedInvoices: deletedInvoices.count, 
            deletedRequests: deletedRequests.count,
            deletedNotifications: deletedNotifications.count,
            invoiceCount,
            requestCount,
            notificationCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to delete resident!`, details: err.message});
    }
}

module.exports = { getResidents, addResident, updateResident, deleteResident , getResidentDetail}