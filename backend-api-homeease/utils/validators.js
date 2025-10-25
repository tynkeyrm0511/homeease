const Joi = require('joi');

//Resident validation schema
const residentSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().optional(),
    apartmentNumber: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'other').optional(),
    address: Joi.string().optional(),
    moveInDate: Joi.date().optional(),
    status: Joi.string().valid('active', 'inactive').optional(),
    role: Joi.string().valid('resident', 'admin').optional()
});

//Invoice validation schema
const invoiceSchema = Joi.object({
    amount: Joi.number().positive().required(),
    dueDate: Joi.date().required(),
    isPaid: Joi.boolean().optional(),
    type: Joi.string().valid('service', 'electricity', 'water', 'parking').required(),
    userId: Joi.number().integer().required()
});

//Request validation schema
const requestSchema = Joi.object({
    // Optional title field (frontend sends `title`) - allow it to avoid Joi unknown key errors
    title: Joi.string().optional(),
    description: Joi.string().required(),
    status: Joi.string().valid('pending', 'in_progress', 'completed', 'rejected', 'cancelled').optional(),
    category: Joi.string().optional(),
    priority: Joi.string().valid('low', 'medium', 'high').optional(),
    // userId is optional because authenticated users will be set from token on the server
    userId: Joi.number().integer().optional()
});

//Notification validation schema
const notificationSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    target: Joi.string().valid('all', 'group', 'residentId').required(),
    userId: Joi.number().integer().optional()
});

module.exports = { residentSchema, invoiceSchema, requestSchema, notificationSchema};