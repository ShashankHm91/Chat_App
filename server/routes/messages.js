// const { addMessage, getMessages } = require("../controllers/messageController");
// const router = require("express").Router();

// router.post("/addmsg/", addMessage);
// router.post("/getmsg/", getMessages);

// module.exports = router;


// Delete added here
const { addMessage, getMessages, deleteAllMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

// New route for deleting all messages
router.delete("/deleteAll", deleteAllMessages);

module.exports = router;
