const prisma = require('../prismaClient');
const { residentSchema } = require('../utils/validators')
//Get all residents - GET
const getResidents = async (req,res) => {
    try{
        const residents = await prisma.user.findMany({
            where: { role: 'resident'}
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

        //Conver date strings to JS Date objects
        const dob = dateOfBirth ? new Date(dateOfBirth) : null;
        const moveIn = moveInDate ? new Date(moveInDate) : null;
        const newResident = await prisma.user.create({
            data: {
                name,
                email,
                password,
                phone,
                apartmentNumber,
                dateOfBirth: dob,
                gender,
                address,
                moveInDate: moveIn,
                status,
                role: 'resident'
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
            status
        } = req.body;

        //Convert date strings to JS Date objects
        const dob = dateOfBirth ? new Date(dateOfBirth) : null;
        const moveIn = moveInDate ? new Date(moveInDate) : null;

        const updatedResident = await prisma.user.update({
            where: {id: Number(id)},
            data: {
                name,
                email,
                password,
                phone,
                apartmentNumber,
                dateOfBirth: dob,
                gender,
                address,
                moveInDate: moveIn,
                status
            }
        });
        res.json(updatedResident);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Failed to update resident'})
    }
}

//Delete resident - DELETE
const deleteResident = async (req,res) => {
    try{
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: Number(id) }
        });
        res.json({ message: 'Resident deleted successfully!'})
    }catch(err){
        console.error(err);
        res.status(500).json({error: `Failed to delete resident!`})
    }
}

module.exports = { getResidents, addResident, updateResident, deleteResident , getResidentDetail}