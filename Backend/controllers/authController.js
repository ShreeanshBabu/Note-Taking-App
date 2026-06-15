import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper - generates JWT and sets it as httpOnly cookie
const sendTokenResponse = (user, res) => {
    const token = jwt.sign(
        {userId: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    );

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        user: {id: user._id, name: user.name, email: user.email},
    });
};

// REGISTER
export const register = async (req,res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({message: 'Name, email and password are required'});
        }

        if (password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters'});
        }

        if (password !== confirmPassword) {
            return res.status(400).json({message: 'Password must be same'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({message: 'Invalid email format'});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({message: 'Email already registered'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password: hashedPassword});

        sendTokenResponse(user,res);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

// LOGIN
export const login = async (req, res) => {
    try{
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password required'});
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        sendTokenResponse(user, res);
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'? 'None' : "Lax",
    });
    res.status(200).json({message: 'Logged out successfully'});
};

// GET CURRENT USER (used by frontent to check if session is still valid)
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({user: {id: user._id, name: user.name, email: user.email}});
    } catch (err) {
        res.status(500).json({message: 'Server error', error: err.message});
    }
};