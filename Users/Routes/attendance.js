import express from 'express';
import attendanceController from '../Controllers/attendance.js';
import tokenVerify from "../Middleware/tokenVerify.js";

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
 *     summary: Get an attendance by id
 *     description: Get an attendance by id
 *     parameters:
 *       - name: attendanceId
 *         in: query
 *         required: true
 *         description: The id of the attendance
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Attendance fetched successfully
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
 *     summary: Update an attendance
 *     description: Update an attendance
 *     parameters:
 *       - name: attendanceId
 *         in: query
 *         required: true
 *         description: The id of the attendance
 *         example: "123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *               - punchIn
 *               - punchOut
 *               - date
 *             properties:
 *               status:
 *                 type: string
 *                 description: The status of the attendance
 *                 example: "Present"
 *               punchIn:
 *                 type: string
 *                 description: The punch in time of the attendance
 *                 example: "09:00:00"
 *               punchOut:
 *                 type: string
 *                 description: The punch out time of the attendance
 *                 example: "18:00:00"
 *               date:
 *                 type: string
 *                 description: The date of the attendance
 *                 example: "2021-01-01"
 *     responses:
 *       200:
 *         description: Attendance updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/updateAttendance', tokenVerify, attendanceController.updateAttendance);

export default router;