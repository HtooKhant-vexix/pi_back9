const express = require("express");
const { authenticate } = require("../middleware/auth");
const SerialController = require("../controllers/serialController");

const router = express.Router();

router.get("/read", SerialController.readData);
router.post("/send", SerialController.sendData);
// router.get('/read', authenticate, SerialController.readData);
// router.post('/send', authenticate, SerialController.sendData);

module.exports = router;
