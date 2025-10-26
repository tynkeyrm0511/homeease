const prisma = require('../prismaClient')
const { notificationSchema } = require('../utils/validators')

//Get all notifications - GET
const getNotifications = async (req,res) => {
    try {
        const { userId } = req.query;
        const where = userId ? { userId: Number(userId) } : {};
        const notification = await prisma.notification.findMany({
            where,
            include: { user: true }
        });
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to fetch notification'
        })
    }
}
//Get notification detail - GET
const getNotificationDetail = async (req,res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.findUnique({
            where: {id:Number(id)},
            include: {user:true}
        });
        if(!notification){
            return res.status(404).json({
                error: `Notification not found`
            })
        }
        res.json(notification);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Failed to fetch notification`
        })        
    }
}

//Add a new notification - POST
const addNotification = async (req,res) => {
    try {
        //Validation request body
        const { error } = notificationSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                error: error.details[0].message
            })
        };

        const {title, content, userId, target, createdAt} = req.body;
        const newNotification = await prisma.notification.create({
            data: {
                title,
                content,
                target,
                userId: userId ? Number(userId) : undefined,
                createdAt: createdAt ? new Date(createdAt) : undefined
            }
        });
        res.status(201).json(newNotification);  
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Falied to create notification`
        })
    }
}
//Update notification - PUT
const updateNotification = async (req,res) => {
    const { id } = req.params;
    const { title, content, userId, target } = req.body;
    const updatedNotification = await prisma.notification.update({
        where: { id: Number(id) },
        data: {
            title,
                content,
                target,
                userId: userId ? Number(userId) : undefined
        }
    });
    res.json(updatedNotification)
}
//Delete notification - DELETE
const deleteNotification = async (req,res) => {
    try {
        const { id } = req.params;
        await prisma.notification.delete({
            where: { id: Number(id) },
        })
        res.json({
            message: `Notification deleted successfully`
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Failed to delete notification`
        })
    }
}
// Get notifications for authenticated user (including global 'all')
const getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.user && req.user.id ? Number(req.user.id) : undefined
        const where = {
            OR: [
                { userId: userId },
                { target: 'all' }
            ]
        }
        const notifications = await prisma.notification.findMany({
            where,
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        })
        res.json(notifications)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch notifications for user' })
    }
}

module.exports = {
    getNotifications,
    getNotificationDetail,
    addNotification,
    updateNotification,
    deleteNotification,
    getNotificationsForUser
}