const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        createdAt: msg.createdAt, // Include the createdAt timestamp
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};


module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};



// Delete one
module.exports.deleteAllMessages = async (req, res, next) => {
  try {
    // Delete all messages from the Messages collection
    await Messages.deleteMany({});
    res.json({ msg: "All messages deleted successfully." });
  } catch (ex) {
    next(ex); // Pass the error to the error-handling middleware
  }
};
