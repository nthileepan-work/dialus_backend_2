const express = require('express');
const { getallController } = require('../Controllers/addsController'); // Import the controller

const router = express.Router();

// Route to get all adds
router.get('/viewall', getallController);

module.exports = router;
