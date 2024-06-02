const express = require('express');
const router = express.Router();
const excelController = require('../Controllers/excelReportController');

router.post('/generate-report', excelController.downloadExcel);

module.exports = router