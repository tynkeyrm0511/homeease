const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto'); // Thêm crypto để tạo reset token

const prisma = new PrismaClient();

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

// Forgot Password - Gửi email với reset token
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email là bắt buộc' });
    }

    // Tìm user theo email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Không tiết lộ thông tin user không tồn tại để tránh email enumeration
      return res.json({ message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn khôi phục mật khẩu' });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // Lưu reset token vào database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Tạo reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

    // TODO: Gửi email với reset link
    // Bạn có thể dùng nodemailer hoặc service khác
    console.log('Reset link:', resetLink);

    res.json({ 
      message: 'Nếu email tồn tại, bạn sẽ nhận được hướng dẫn khôi phục mật khẩu',
      // Trong development, trả về link để test
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
};

// Reset Password - Cập nhật mật khẩu mới
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token và mật khẩu là bắt buộc' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    // Tìm user theo reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token chưa hết hạn
        }
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu và xóa reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({ message: 'Mật khẩu đã được cập nhật thành công' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra' });
  }
};

// Verify Token (optional - để check token validity)
const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token không được cung cấp' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Sửa: Dùng decoded.userId thay vì decoded.id (vì token chứa userId)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },  // Thay đổi từ decoded.id thành decoded.userId
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'User không tồn tại' });
    }

    res.json({ user });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  resetPassword,
  verifyToken
};