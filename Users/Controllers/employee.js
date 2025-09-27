import All_Models from "../../Utils/All_Models.js";

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

        res.status(201).json(newEmployee);

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
        if (!employeeId) {
            return res.status(400).json({ message: "id does not exist" });
        }
        const updatedEmployee = await All_Models.Employee.update(
            { id },
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
            { new: true }
        );
        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: "Error updating employee", error: error.message });
    }
};

employeeController.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.query;

        const deletedEmployee = await All_Models.Employee.destroy({ where: { id } });
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error: error.message });
    }
};

export default employeeController;