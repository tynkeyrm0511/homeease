const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const register = async (req,res) => {
    try {
        const { name, email, password, role } = req.body;

        //Check if emial already exists
        const existingUser = await prisma.user.findUnique({
            where: {email}
        });
        if(existingUser){
            return res.status(400).json({
                error: 'Email already exists'
            })
        }

        //Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new user in database
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'resident'
            }
        });

        //Respond with basic user infor (no pass)
        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Failed to register'
        })
    }
}

//Login user and return JWT token
const login = async (req,res) => {
    try {
        const { email, password } = req.body;
        //Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if(!user){
            return res.status(400).json({
                error: `Invalid email or password`
            })
        }
        //Compare password with hashed password in db
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                error: `Invalid email or password`
            }) 
        }

        //Generate JWT token with user id and role
        const token = jwt.sign(
            {userId: user.id, role: user.role},
            JWT_SECRET,
            {expiresIn: '2h'}
        );

        //Respond with token and basic user info
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: `Failed to login`
        })
    }
}
module.exports = { register, login }