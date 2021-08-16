import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const signIn = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) return res.status(404).json({ message: 'Username does not exist.' });
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials.' });
        const token = jwt.sign({ username: existingUser.username, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ result: existingUser, token });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
};

export const signUp = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists.' });
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ username, password: hashedPassword });
        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ result: result, token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong.' });
    }
};
