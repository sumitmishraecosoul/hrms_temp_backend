import All_Models from "../../Utils/All_Models.js";
import { createDirectory } from "../../Utils/directoryFunctions.js";
import { singleFileUpload } from "../../Utils/singleFileUpload.js";
import csvParser from "../../Utils/csvParser.js";

const employeeController = {}

employeeController.createEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            department,
            designation,
            dateOfJoining,
            biometricId,
            gender,
            company
        } = req.body;

        const newEmployee = new All_Models.Employee({
            name,
            email,
            department,
            designation,
            dateOfJoining,
            biometricId,
            gender,
            company
        });

        await newEmployee.save();

        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });

    } catch (error) {
        res.status(500).json({ message: "Error creating employee", error: error.message });
    }
};

employeeController.getAllEmployees = async (req, res) => {
    try {
        const employees = await All_Models.Employee.findAll();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error: error.message });
    }
};

employeeController.getEmployeeById = async (req, res) => {
    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: "id parameter is required" });
        }

        console.log(id);
        
        const employee = await All_Models.Employee.findOne({ where: { id } });  
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee", error: error.message });
    }
};

employeeController.updateEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            department,
            designation,
            dateOfJoining,
            biometricId,
            gender,
            company
        } = req.body;

        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ message: "id parameter is required" });
        }
        const [updatedRowsCount] = await All_Models.Employee.update(
            {
                name,
                email,
                department,
                designation,
                dateOfJoining,
                biometricId,
                gender,
                company
            },
            {
                where: { id }
            }
        );
        
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }
        
        // Fetch the updated employee to return it
        const updatedEmployee = await All_Models.Employee.findOne({ where: { id } });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error: error.message });
    }
};

employeeController.deleteEmployee = async (req, res) => {
    try {
        const {id} = req.query;


        if (!id) {
            return res.status(400).json({ message: "id parameter is required" });
        }

        const deletedEmployee = await All_Models.Employee.destroy(
            { where: { id } });

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};

employeeController.uploadEmployeeSheet = async (req, res) => {
    try {
        const file = req.files?.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const path = `upload/employeeSheets/${Date.now()}_${file.name}`;

        await createDirectory('upload/employeeSheets');
        await singleFileUpload(
            { ...req, files: { file } }, 
            { ...res, path: path });

        const rows = await csvParser(path);

        const mappedEmployees = rows.map(row => ({
            name: row.name || row.Name || row['Name'] || "",
            email: row.email || row.Email || row['E-mail'] || "",
            department: row.department || row.Department || row['Department'] || "",
            designation: row.designation || row.Designation || row['Designation'] || "",
            dateOfJoining: row.dateOfJoining || row.DateOfJoining || row['DateOfJoining'] || "",
            biometricId: row.biometricId || row.BiometricId || row['BiometricId'] || "",
            gender: row.gender || row.Gender || row['Gender'] || "",
            company: row.company || row.Company || row['Company'] || ""
        }));

        const createdEmployees = await All_Models.Employee.bulkCreate(mappedEmployees);

        res.status(200).json({
            message: "Employee sheet uploaded and employees created successfully",
            createdCount: createdEmployees.length
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading employee sheet", error: error.message });
    }
}

employeeController.getEcoSoulEmployees = async (req, res) => {
    try {
        const employees = await All_Models.Employee.findAll({ where: { company: 'EcoSoul' } });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching EcoSoul employees", error: error.message });
    }
}

employeeController.getThriveBrandsEmployees = async (req, res) => {
    try {
        const employees = await All_Models.Employee.findAll({ where: { company: 'ThriveBrands' } });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ThriveBrands employees", error: error.message });
    }
}

export default employeeController;