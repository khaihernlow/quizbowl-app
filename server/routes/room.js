const express = require('express');

const { getRoom } = require('../controllers/room.js');

const router = express.Router();

router.get('/:roomID', getRoom);

module.exports = router;