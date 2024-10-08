const express = require('express');
const { auth } = require('../middlewares/auth.js');
const { getRoom } = require('../controllers/room.js');

const router = express.Router();

router.get('/:roomID', getRoom);

module.exports = router;