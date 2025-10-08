const prisma = require('../prismaClient');
const { requestSchema } = require('../utils/validators');

//Get all requests - GET
const getRequests = async (req,res) => {
    try {
        const requests = await prisma.request.findMany({
            include: {user:true}
        });
        res.json(requests);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to fetch requests`});
    }
}
//Get request detail - GET
const getRequestDetail = async (req,res) => {
    try {
        const { id } = req.params;
        const request = await prisma.request.findUnique({
            where: {id: Number(id)},
            include: { user: true}
        });
        if(!request){
            return res.status(404).json({error: `Request not found`});
        }
        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: `Failed to fetch request detail`});
    }
}
//Add a new request - POST
const addRequest = async (req,res) => {
    try {
        //Validation request body
        const { error } = requestSchema.validate(req.body);
        if(error){
            return res.status(400).json({
                error: error.details[0].message
            })
        };

        const {
            description,
            status,
            category,
            priority,
            userId
        } = req.body;
        const newRequest = await prisma.request.create({
            data: {
                description,
                status: status || 'pending',
                category,
                priority: priority || 'medium',
                userId: Number(userId)
            }
        });
        res.json(newRequest)
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Failed to create request`
        })
    }
}
//Update request - PUT
const updateRequest = async (req,res) => {
    try {
        const { id } = req.params;
        const {
                description,
                status,
                category,
                priority,
                userId
            } = req.body;
        const updatedRequest = await prisma.request.update({
            where: {id:Number(id)},
            data: {
                description,
                status,
                category,
                priority,
                userId: userId ? Number(userId) : undefined
            }
        });
        res.status(201).json({updatedRequest})
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Failed to update request`
        })
    }
}

//Delete request - DELETE
const deleteRequest = async (req,res) => {
    try {
        const { id } = req.params;
        await prisma.request.delete({
            where: {id: Number(id)}
        });
        res.json({
            message: `Request deleted successfully`
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: `Failed to delete request`
        })
    }
}

module.exports = {
    getRequests, 
    getRequestDetail, 
    addRequest, 
    updateRequest, 
    deleteRequest
};