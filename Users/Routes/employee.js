import express from 'express';
import employeeController from '../Controllers/employee.js';
import tokenVerify from '../Middleware/tokenVerify.js';

const router = express.Router();

/**
 * @swagger
 * /employee/createEmployee:
 *   post:
 *     tags:
 *       - Employee
 *     summary: Create a new employee
 *     description: Create a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - name
 *               - email
 *               - department
 *               - designation
 *               - dateOfJoining
 *               - biometricId
 *               - gender
 *             properties:
 *               employeeId:
 *                 type: string
 *                 description: The id of the employee
 *                 example: "123456"
 *               name:
 *                 type: string
 *                 description: The name of the employee
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email of the employee
 *                 example: "john.doe@example.com"
*               department:
 *                 type: string
 *                 description: The department of the employee
 *                 example: "IT"
 *               designation:
 *                 type: string
 *                 description: The designation of the employee
 *                 example: "Software Engineer"
 *               dateOfJoining:
 *                 type: string
 *                 description: The date of joining of the employee
 *                 example: "2021-01-01"
 *               biometricId:
 *                 type: string
 *                 description: The biometric id of the employee
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: The gender of the employee
 *                 example: "Male"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Employee already exists
 *       500:
 *         description: Internal server error
 */
router.post('/createEmployee', tokenVerify, employeeController.createEmployee);

/**
 * @swagger
 * /employee/getAllEmployees:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get all employees
 *     description: Get all employees
 *     responses:
 *       200:
 *         description: Employees fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getAllEmployees', tokenVerify, employeeController.getAllEmployees);

/**
 * @swagger
 * /employee/getEmployeeById:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get an employee by id
 *     description: Get an employee by id
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The id of the employee
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Employee fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getEmployeeById', tokenVerify, employeeController.getEmployeeById);

/**
 * @swagger
 * /employee/updateEmployee:
 *   put:
 *     tags:
 *       - Employee
 *     summary: Update an employee
 *     description: Update an employee
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The id of the employee
 *         example: "123456"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - department
 *               - designation
 *               - dateOfJoining
 *               - biometricId
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the employee
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: The email of the employee
 *                 example: "john.doe@example.com"
 *               department:
 *                 type: string
 *                 description: The department of the employee
 *                 example: "IT"
 *               designation:
 *                 type: string
 *                 description: The designation of the employee
 *                 example: "Software Engineer"
 *               dateOfJoining:
 *                 type: string
 *                 description: The date of joining of the employee
 *                 example: "2021-01-01"
 *               biometricId:
 *                 type: string
 *                 description: The biometric id of the employee
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: The gender of the employee
 *                 example: "Male"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/updateEmployee', tokenVerify, employeeController.updateEmployee);

/**
 * @swagger
 * /employee/deleteEmployee:
 *   delete:
 *     tags:
 *       - Employee
 *     summary: Delete an employee
 *     description: Delete an employee
 *     parameters:
 *       - name: employeeId
 *         in: query
 *         required: true
 *         description: The id of the employee
 *         example: "123456"
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       500:
 *         description: Internal server error
 */
router.delete('/deleteEmployee', tokenVerify, employeeController.deleteEmployee);

export default router;