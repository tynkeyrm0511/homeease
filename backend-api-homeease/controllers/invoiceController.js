const { required } = require('joi');
const prisma = require('../prismaClient');
const { invoiceSchema } = require('../utils/validators.js')

//Get all invoices - GET
const getInvoices = async (req,res) => {
    try{
        const { userId } = req.query;
        let where = {};
        if (userId) {
            where.userId = Number(userId);
        }
        const invoices = await prisma.invoice.findMany({
            where,
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
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch invoice detail'
        })
    }
}
// Add a new invoice - POST
const addInvoice = async (req,res) => {
    try {
        //Validation request body
        const { error } = invoiceSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                error: error.details[0].message
            })
        }
        
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

// Create a mock payment session for an invoice
const { v4: uuidv4 } = require('uuid');

const createPaymentSession = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({ where: { id: Number(id) }, include: { user: true } });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

            // Only owner or admin can create a payment session
            // Allow bypass during local demo when SKIP_OWNER_CHECK=true in .env
            const skipCheck = String(process.env.SKIP_OWNER_CHECK || '').toLowerCase() === 'true';
            // Debug logs to help diagnose authorization issues in dev
            console.log('createPaymentSession: SKIP_OWNER_CHECK=', skipCheck);
            console.log('createPaymentSession: req.user=', req.user ? { id: req.user.id, role: req.user.role } : null);
            console.log('createPaymentSession: invoice.userId=', invoice.userId);
            if (!skipCheck) {
                if (req.user.role !== 'admin' && req.user.id !== invoice.userId) {
                    return res.status(403).json({ error: 'Not authorized' });
                }
            } else {
                console.log('Dev skip owner check enabled (SKIP_OWNER_CHECK=true)');
            }

        if (invoice.isPaid) return res.status(400).json({ error: 'Invoice already paid' });

        const sessionId = uuidv4();
        const paymentUrl = `${process.env.APP_BASE_URL || 'http://localhost:3000'}/invoice/mock-pay/${sessionId}`;

        const updated = await prisma.invoice.update({ where: { id: Number(id) }, data: { paymentSessionId: sessionId, paymentStatus: 'pending' } });

        // Simple QR data: encode the paymentUrl (frontend can render a QR from this)
        res.json({ sessionId, paymentUrl, qrData: paymentUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
}

// Get payment status for invoice
const getPaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await prisma.invoice.findUnique({ where: { id: Number(id) } });
        if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
        res.json({ status: invoice.paymentStatus || (invoice.isPaid ? 'succeeded' : 'pending'), paidAt: invoice.paidAt, transactionId: invoice.paymentTransactionId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch payment status' });
    }
}

// Confirm mock payment (simulate provider callback) - sessionId in path
const confirmMockPayment = async (req, res) => {
    try {
        const { sessionId } = req.params;
        // find invoice with this session
        const invoice = await prisma.invoice.findFirst({ where: { paymentSessionId: sessionId } });
        if (!invoice) return res.status(404).json({ error: 'Payment session not found' });

        if (invoice.isPaid) return res.json({ message: 'Already paid' });

        const tx = uuidv4();
        const updated = await prisma.invoice.update({ where: { id: invoice.id }, data: { isPaid: true, paidAt: new Date(), paymentStatus: 'succeeded', paymentTransactionId: tx } });

            // Emit websocket event if Socket.IO is attached
            try {
                const io = req.app?.locals?.io;
                if (io) {
                    io.emit('invoice:paid', { invoiceId: updated.id, paidAt: updated.paidAt, transactionId: tx });
                }
            } catch (e) {
                console.warn('Socket emit failed', e.message);
            }

            res.json({ message: 'Payment confirmed', transactionId: tx, invoice: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
}

// Render a simple mock payment HTML page for demo (public)
const renderMockPayPage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const invoice = await prisma.invoice.findFirst({ where: { paymentSessionId: sessionId }, include: { user: true } });
        if (!invoice) return res.status(404).send('<h3>Payment session not found</h3>');

        const html = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <title>Mock Pay - Invoice ${invoice.id}</title>
                </head>
                <body style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Thanh toán hóa đơn #${invoice.id}</h2>
                    <p>Số tiền: <strong>${invoice.amount?.toLocaleString ? invoice.amount.toLocaleString() : invoice.amount} VNĐ</strong></p>
                    <p>Người nhận: ${invoice.user?.name || 'N/A'}</p>
                    <div style="margin-top:20px;">
                        <button id="payBtn" style="padding:10px 16px; background:#2563eb; color:#fff; border:none; border-radius:6px; cursor:pointer;">Simulate Payment</button>
                        <span id="msg" style="margin-left:12px;color:green"></span>
                    </div>
                    <script>
                        document.getElementById('payBtn').addEventListener('click', async function(){
                            try{
                                const res = await fetch('/invoice/mock-pay/${sessionId}/confirm', { method: 'POST' });
                                const j = await res.json();
                                document.getElementById('msg').innerText = j.message || 'OK';
                                // optionally redirect back to app
                            }catch(e){
                                document.getElementById('msg').innerText = 'Error';
                            }
                        })
                    </script>
                </body>
            </html>
        `;

        res.send(html);
    } catch (err) {
        console.error(err);
        res.status(500).send('<h3>Server error</h3>');
    }
}

// Mẫu export đúng
module.exports = {
    getInvoices,
    getInvoiceDetail,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    // mock payment exports
    createPaymentSession,
    getPaymentStatus,
    confirmMockPayment
    ,renderMockPayPage
};