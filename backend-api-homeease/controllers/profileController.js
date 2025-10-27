const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const Joi = require('joi');

// Profile validation schema
const profileUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(100),
    phone: Joi.string().pattern(/^[0-9+()-\s]{10,15}$/),
    apartmentNumber: Joi.string(),
    houseNumber: Joi.string(),
    dateOfBirth: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    address: Joi.string(),
    moveInDate: Joi.date().iso()
});

const passwordUpdateSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                apartmentNumber: true,
                houseNumber: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                moveInDate: true,
                status: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { error, value } = profileUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: value,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                phone: true,
                apartmentNumber: true,
                houseNumber: true,
                dateOfBirth: true,
                gender: true,
                address: true,
                moveInDate: true,
                status: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('updateProfile error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { error, value } = passwordUpdateSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(value.currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(value.newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('updatePassword error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get user statistics
const getProfileStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const [invoiceStats, requestStats] = await Promise.all([
            // Get invoice statistics
            prisma.invoice.groupBy({
                by: ['isPaid'],
                where: { userId },
                _count: true,
                _sum: { amount: true }
            }),

            // Get request statistics
            prisma.request.groupBy({
                by: ['status'],
                where: { userId },
                _count: true
            })
        ]);

        // Format invoice stats
        const invoices = {
            total: 0,
            paid: 0,
            unpaid: 0,
            totalAmount: 0,
            paidAmount: 0,
            unpaidAmount: 0
        };

        invoiceStats.forEach(stat => {
            if (stat.isPaid) {
                invoices.paid = stat._count;
                invoices.paidAmount = stat._sum.amount;
            } else {
                invoices.unpaid = stat._count;
                invoices.unpaidAmount = stat._sum.amount;
            }
        });
        invoices.total = invoices.paid + invoices.unpaid;
        invoices.totalAmount = invoices.paidAmount + invoices.unpaidAmount;

        // Format request stats
        const requests = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0,
            rejected: 0
        };

        requestStats.forEach(stat => {
            requests[stat.status.toLowerCase()] = stat._count;
            requests.total += stat._count;
        });

        res.json({
            invoices,
            requests
        });
    } catch (error) {
        console.error('getProfileStats error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updatePassword,
    getProfileStats
};