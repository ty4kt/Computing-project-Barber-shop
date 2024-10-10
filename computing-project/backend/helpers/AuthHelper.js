const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const authHelpers = {

    hashPassword: async (password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },

    comparePassword: async (password, hash) => {
        return await bcrypt.compare(password, hash);
    },
    
    generateToken: (user) => {
        const token = jwt.sign({
            id: user._id,
            username: user.username,
        }, jwtSecret, { expiresIn: '1h' });

        return token;
    },

    verifyToken: (token) => {
        try {
            const decoded = jwt.verify(token, jwtSecret);
            return decoded;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

module.exports = authHelpers;