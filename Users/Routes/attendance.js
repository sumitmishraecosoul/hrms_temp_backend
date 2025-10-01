import express from 'express';
import attendanceController from '../Controllers/attendance.js';
import tokenVerify from "../Middleware/tokenVerify.js";
import { singleFileUpload } from '../../Utils/singleFileUpload.js';
import { createDirectory } from '../../Utils/directoryFunctions.js';

const router = express.Router();

/**
 * @swagger
 * /attendance/getAllAttendances:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get all attendances
 *     description: Get all attendances
 *     responses:
 *       200:
 *         description: Attendances fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getAllAttendances', tokenVerify, attendanceController.getAllAttendances);

/**
 * @swagger
 * /attendance/getAttendanceById:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get an attendance by employee ID and date
 *     description: Get an attendance record for a specific employee on a specific date
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The ID of the employee
 *         example: "123"
 *       - name: date
 *         in: query
 *         required: true
 *         description: The date of attendance (YYYY-MM-DD)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Internal server error
 */
router.get('/getAttendanceById', tokenVerify, attendanceController.getAttendanceById);

/**
 * @swagger
 * /attendance/updateAttendance:
 *   put:
 *     tags:
 *       - Attendance
 *     summary: Update an attendance record
 *     description: Update an attendance record with 1-week modification restriction
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The ID of the employee
 *         example: "123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - date
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Present, Absent]
 *                 description: The status of the attendance
 *                 example: "Present"
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       400:
 *         description: Bad request or modification not allowed
 *       404:
 *         description: Attendance not found
 *       500:
 *         description: Internal server error
 */
router.put('/updateAttendance', tokenVerify, attendanceController.updateAttendance);

/**
 * @swagger
 * /attendance/markAttendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Mark attendance for an employee
 *     description: Create a new attendance record for an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - name
 *               - status
 *               - date
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee
 *                 example: 123
 *               name:
 *                 type: string
 *                 description: The name of the employee
 *                 example: "John Doe"
 *               status:
 *                 type: string
 *                 enum: [Present, Absent, Half Day, Late]
 *                 description: The status of the attendance
 *                 example: "Present"
 *               punchIn:
 *                 type: string
 *                 description: The punch in time (HH:MM:SS)
 *                 example: "09:00:00"
 *               punchOut:
 *                 type: string
 *                 description: The punch out time (HH:MM:SS)
 *                 example: "18:00:00"
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the attendance
 *                 example: "2024-01-15"
 *               remarks:
 *                 type: string
 *                 description: Additional notes
 *                 example: "Regular working day"
 *     responses:
 *       201:
 *         description: Attendance marked successfully
 *       400:
 *         description: Bad request or attendance already exists
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.post('/markAttendance', tokenVerify, attendanceController.markAttendance);

/**
 * @swagger
 * /attendance/getEmployeeAttendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get attendance records for a specific employee
 *     description: Get attendance records for a specific employee with optional date range
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The ID of the employee
 *         example: "123"
 *       - name: startDate
 *         in: query
 *         required: false
 *         description: Start date for filtering (YYYY-MM-DD)
 *         example: "2024-01-01"
 *       - name: endDate
 *         in: query
 *         required: false
 *         description: End date for filtering (YYYY-MM-DD)
 *         example: "2024-01-31"
 *     responses:
 *       200:
 *         description: Employee attendance records fetched successfully
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */
router.get('/getEmployeeAttendance', tokenVerify, attendanceController.getEmployeeAttendance);

/**
 * @swagger
 * /attendance/getDailyAttendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Get all employees' attendance for a specific date
 *     description: Get attendance records for all employees on a specific date
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: The date to get attendance for (YYYY-MM-DD)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Daily attendance records fetched successfully
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
router.get('/getDailyAttendance', tokenVerify, attendanceController.getDailyAttendance);

/**
 * @swagger
 * /attendance/uploadAttendanceSheet:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Upload attendance sheet from CSV
 *     description: Bulk upload attendance records from a CSV file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing attendance data with columns (employeeId, name, status, punchIn, punchOut, remarks, date)
 *                 example: "attendance_data.csv"
 *     responses:
 *       200:
 *         description: Attendance sheet uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: array
 *                   description: Successfully processed records
 *                 errors:
 *                   type: array
 *                   description: Records with errors
 *                 total:
 *                   type: number
 *                   description: Total number of records processed
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error uploading attendance sheet
 */
router.post('/uploadAttendanceSheet', tokenVerify, async (req, res) => {
    try {
        const file = req.files?.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const path = `upload/attendanceSheets/${Date.now()}_${file.name}`;
        await createDirectory('upload/attendanceSheets');
        await singleFileUpload(
            { ...req, files: { file } }, 
            { ...res, path: path });

        req.file = { path };
        attendanceController.uploadAttendanceSheet(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
});

/**
 * @swagger
 * /attendance/previewAttendanceSheet:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Preview attendance sheet before upload
 *     description: Preview and validate CSV data before bulk upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file to preview
 *                 example: "attendance_data.csv"
 *     responses:
 *       200:
 *         description: Attendance sheet preview generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRows:
 *                   type: number
 *                   description: Total number of rows in CSV
 *                 previewRows:
 *                   type: number
 *                   description: Number of valid preview rows
 *                 preview:
 *                   type: array
 *                   description: Preview of valid rows
 *                 errors:
 *                   type: array
 *                   description: Rows with validation errors
 *                 sampleData:
 *                   type: array
 *                   description: Sample data from CSV
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error previewing attendance sheet
 */
router.post('/previewAttendanceSheet', tokenVerify, async (req, res) => {
    try {
        const file = req.files?.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const path = `upload/attendanceSheets/${Date.now()}_${file.name}`;
        await createDirectory('upload/attendanceSheets');
        await singleFileUpload(
            { ...req, files: { file } }, 
            { ...res, path: path });

        req.file = { path };
        attendanceController.previewAttendanceSheet(req, res);
    } catch (error) {
        res.status(500).json({ message: "Error uploading file", error: error.message });
    }
});

/**
 * @swagger
 * /attendance/canModifyAttendance:
 *   get:
 *     tags:
 *       - Attendance
 *     summary: Check if attendance can be modified
 *     description: Check if an attendance record can be modified based on 1-week rule
 *     parameters:
 *       - name: date
 *         in: query
 *         required: true
 *         description: The date of the attendance to check (YYYY-MM-DD)
 *         example: "2024-01-15"
 *     responses:
 *       200:
 *         description: Modification status checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 canModify:
 *                   type: boolean
 *                   description: Whether the attendance can be modified
 *                 date:
 *                   type: string
 *                   description: The date that was checked
 *                 reason:
 *                   type: string
 *                   description: Reason for the modification status
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Internal server error
 */
router.get('/canModifyAttendance', tokenVerify, attendanceController.canModifyAttendance);

export default router;