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
 *               - name
 *               - email
 *               - department
 *               - designation
 *               - biometricId
 *               - gender
 *               - company
 *               - dateOfBirth
 *               - workAnniversary
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
 
 *               biometricId:
 *                 type: string
 *                 description: The biometric id of the employee
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: The gender of the employee
 *                 example: "Male"
 *               company:
 *                 type: string
 *                 description: The company of the employee
 *                 example: "Thrive Brands"
 *               workAnniversary:
 *                 type: string
 *                 description: The work anniversary of the employee (YYYY-MM-DD)
 *                 example: "2021-01-01"
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Employee already exists
 *       500:
 *         description: Internal server error
 */
router.post('/createEmployee', employeeController.createEmployee);

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
router.get('/getAllEmployees', employeeController.getAllEmployees);

/**
 * @swagger
 * /employee/getEmployeeById:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get an employee by id
 *     description: Get an employee by id
 *     parameters:
 *       - name: id
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
router.get('/getEmployeeById', employeeController.getEmployeeById);

/**
 * @swagger
 * /employee/updateEmployee:
 *   put:
 *     tags:
 *       - Employee
 *     summary: Update an employee
 *     description: Update an employee
 *     parameters:
 *       - name: id
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
 *               - biometricId
 *               - gender
 *               - company
 *               - dateOfBirth
 *               - workAnniversary
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
 *               biometricId:
 *                 type: string
 *                 description: The biometric id of the employee
 *                 example: "password123"
 *               gender:
 *                 type: string
 *                 description: The gender of the employee
 *                 example: "Male"
 *               company:
 *                 type: string
 *                 description: The company of the employee
 *                 example: "Thrive Brands"
 *               dateOfBirth:
 *                 type: string
 *                 description: The date of birth of the employee (YYYY-MM-DD)
 *                 example: "2021-01-01"
 *               workAnniversary:
 *                 type: string
 *                 description: The work anniversary of the employee (YYYY-MM-DD)
 *                 example: "2021-01-01"
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       500:
 *         description: Internal server error
 */
router.put('/updateEmployee', employeeController.updateEmployee);

/**
 * @swagger
 * /employee/deleteEmployee:
 *   delete:
 *     tags:
 *       - Employee
 *     summary: Delete an employee
 *     description: Delete an employee
 *     parameters:
 *       - name: id
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
router.delete('/deleteEmployee', employeeController.deleteEmployee);

/**
 * @swagger
 * /employee/uploadEmployeeSheet:
 *   post:
 *     tags:
 *       - Employee
 *     summary: Upload an employee sheet
 *     description: Upload a CSV file containing employee data to bulk create employees
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
 *                 description: CSV file containing employee data with columns (name, email, department, designation, biometricId, gender, company)
 *                 example: "employee_data.csv"
 *     responses:
 *       200:
 *         description: Employee sheet uploaded and employees created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee sheet uploaded and employees created successfully"
 *                 createdCount:
 *                   type: number
 *                   example: 25
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No file uploaded"
 *       500:
 *         description: Error uploading employee sheet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error uploading employee sheet"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.post('/uploadEmployeeSheet', employeeController.uploadEmployeeSheet);

/**
 * @swagger
 * /employee/getEcoSoulEmployees:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get all EcoSoul employees
 *     description: Get all EcoSoul employees
 *     responses:
 *       200:
 *         description: EcoSoul employees fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getEcoSoulEmployees', employeeController.getEcoSoulEmployees);

/**
 * @swagger
 * /employee/getThriveBrandsEmployees:
 *   get:
 *     tags:
 *       - Employee
 *     summary: Get all ThriveBrands employees
 *     description: Get all ThriveBrands employees
 *     responses:
 *       200:
 *         description: ThriveBrands employees fetched successfully
 *       500:
 *         description: Internal server error
 */
router.get('/getThriveBrandsEmployees', employeeController.getThriveBrandsEmployees);

export default router;