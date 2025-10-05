const prisma = require('../prismaClient');

//Get all invoices - GET
const getInvoices = async (req,res) => {
    try{
        const invoices = await prisma.invoice.findMany({
            include: { user: true}
        });
        res.json(invoices);
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Failed to fetch invoices`})
    }
}

//Get incoide detail - GET
const getInvoiceDetail = async (req,res) => {
    try{
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({
            where: { id: Number(id) },
            include: { user: true}
        });
        if(!invoice){
            return res.status(404).json({error: `Invoice not found`})
        }
        res.json(invoice)
    }catch(err){

    }
}
// Add a new invoice - POST
const addInvoice = async (req,res) => {
    try {
        const {
            amount,
            dueDate,
            isPaid,
            type,
            createdAt,
            paidAt,
            userId
        } = req.body;

        const newInvoice = await prisma.invoice.create({
            data: {
                amount: parseFloat(amount),
                dueDate: dueDate ? new Date(dueDate) : undefined,
                isPaid: isPaid || false,
                type,
                createdAt: createdAt ? new Date(createdAt) : undefined,
                paidAt: paidAt ? new Date(paidAt) : undefined,
                userId: Number(userId)
            }
        });
        res.status(201).json(newInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to add a new invoice`})
    }
}
//Update invoice - PUT
const updateInvoice = async (req,res) => {
    try {
        const { id } = req.params;
        const {
            amount,
            dueDate,
            isPaid,
            type,
            createdAt,
            paidAt,
            userId
        } = req.body;

        const updatedInvoice = await prisma.invoice.update({
            where: {id: Number(id)},
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                isPaid,
                type,
                createdAt: createdAt ? new Date(createdAt) : undefined,
                paidAt: paidAt ? new Date(paidAt) : undefined,
                userId: userId ? Number(userId) : undefined
            }
        });
        res.json(updatedInvoice);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to update invoice!`})
    }
}
//Delete invoice - DELETE
const deleteInvoice = async (req,res) => {
    try {
        const { id } = req.params;
        await prisma.invoice.delete({
            where: {id: Number(id)}
        });
        res.json({message: `Invoice deleted successfully`});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to delete invoice`})
    }
}
module.exports = {getInvoices, getInvoiceDetail, addInvoice, updateInvoice, deleteInvoice}