const Room = require('../models/Room.js');

exports.getRoom = async (req, res) => {
  const { roomID } = req.params;

  try {
    const room = await Room.findOne({ roomID });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
