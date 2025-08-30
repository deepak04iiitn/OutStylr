import express from 'express';
import {deleteUser, getUser, getusers, signout, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Add this route
router.get('/check-auth', verifyToken, (req, res) => {
    res.status(200).json({ valid: true });
});

router.get('/getusers', verifyToken, getusers);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/:userId', verifyToken, getUser);

export default router;