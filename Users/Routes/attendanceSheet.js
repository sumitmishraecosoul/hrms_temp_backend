// import express from 'express';
// import attendanceSheetController from '../Controllers/attendanceSheet.js';

// const router = express.Router();

// /**
//  * @swagger
//  * /attendanceSheet/uploadAttendanceSheet:
//  *   post:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Upload an attendance sheet
//  *     description: Upload an attendance sheet
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - attendanceSheet
//  *             properties:
//  *               attendanceSheet:
//  *                 type: string
//  *                 format: binary
//  *                 description: CSV/XLSX file containing attendance data
//  *               percentage:
//  *                 type: string
//  *                 description: Optional percentage metadata
//  *               date:
//  *                 type: string
//  *                 format: date
//  *                 description: Optional date for the sheet
//  *     responses:
//  *       200:
//  *         description: Attendance sheet uploaded successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.post('/uploadAttendanceSheet', attendanceSheetController.uploadAttendanceSheet);

// /**
//  * @swagger
//  * /attendanceSheet/updateAttendanceSheet:
//  *   put:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Update an attendance sheet
//  *     description: Update an attendance sheet
//  *     parameters:
//  *       - name: attendanceSheetId
//  *         in: query
//  *         required: true
//  *         description: The id of the attendance sheet
//  *         example: "123456"
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - percentage
//  *             properties:
//  *               percentage:
//  *                 type: string
//  *                 description: The percentage of the attendance sheet
//  *                 example: "80"
//  *               date:
//  *                 type: string
//  *                 format: date
//  *                 description: Optional date for the sheet
//  *     responses:
//  *       200:
//  *         description: Attendance sheet updated successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.put('/updateAttendanceSheet', attendanceSheetController.updateAttendanceSheet);

// /**
//  * @swagger
//  * /attendanceSheet/getAllAttendanceSheets:
//  *   get:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Get all attendance sheets
//  *     description: Get all attendance sheets
//  *     responses:
//  *       200:
//  *         description: Attendance sheets fetched successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/getAllAttendanceSheets', attendanceSheetController.getAllAttendanceSheets);

// /**
//  * @swagger
//  * /attendanceSheet/getAttendanceSheetById:
//  *   get:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Get an attendance sheet by id
//  *     description: Get an attendance sheet by id
//  *     parameters:
//  *       - name: attendanceSheetId
//  *         in: query
//  *         required: true
//  *         description: The id of the attendance sheet
//  *         example: "123456"
//  *     responses:
//  *       200:
//  *         description: Attendance sheet fetched successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/getAttendanceSheetById', attendanceSheetController.getAttendanceSheetById);

// /**
//  * @swagger
//  * /attendanceSheet/deleteAttendanceSheet:
//  *   delete:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Delete an attendance sheet
//  *     description: Delete an attendance sheet
//  *     parameters:
//  *       - name: attendanceSheetId
//  *         in: query
//  *         required: true
//  *         description: The id of the attendance sheet
//  *         example: "123456"
//  *     responses:
//  *       200:
//  *         description: Attendance sheet deleted successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.delete('/deleteAttendanceSheet', attendanceSheetController.deleteAttendanceSheet);

// /**
//  * @swagger
//  * /attendanceSheet/previewAttendanceSheet:
//  *   get:
//  *     tags:
//  *       - AttendanceSheet
//  *     summary: Preview an attendance sheet
//  *     description: Preview an attendance sheet
//  *     parameters:
//  *       - name: attendanceSheetId
//  *         in: query
//  *         required: true
//  *         description: The id of the attendance sheet
//  *         example: "123456"
//  *     responses:
//  *       200:
//  *         description: Attendance sheet previewed successfully
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/previewAttendanceSheet', attendanceSheetController.previewAttendanceSheet);

// export default router;