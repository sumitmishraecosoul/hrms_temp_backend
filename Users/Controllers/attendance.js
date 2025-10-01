import All_Models from "../../Utils/All_Models.js";
import csvParser from "../../Utils/csvParser.js";

const attendanceController = {}

// Helper function to calculate working hours
const calculateWorkingHours = (punchIn, punchOut) => {
    if (!punchIn || !punchOut) return null;
    
    const [inHour, inMin] = punchIn.split(':').map(Number);
    const [outHour, outMin] = punchOut.split(':').map(Number);
    
    const inMinutes = inHour * 60 + inMin;
    const outMinutes = outHour * 60 + outMin;
    
    const diffMinutes = outMinutes - inMinutes;
    return Math.round((diffMinutes / 60) * 100) / 100; // Round to 2 decimal places
};

// Helper function to check if attendance can be modified (1-week rule)
const canModifyAttendance = (date) => {
    const attendanceDate = new Date(date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return attendanceDate >= oneWeekAgo;
};

attendanceController.getAllAttendances = async (req, res) => {
    try {
        const attendances = await All_Models.Attendance.findAll();
        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendances", error: error.message });
    }
};

attendanceController.getAttendanceById = async (req, res) => {
    try {
        const { employeeId, date } = req.query;

        if (!employeeId || !date) {
            return res.status(400).json({ message: "employeeId and date are required" });
        }

        const attendance = await All_Models.Attendance.findOne({ 
            where: { employeeId, date },
            include: [{
                model: All_Models.Employee,
                attributes: ['name', 'email', 'department', 'designation', 'biometricId']
            }]
        });
        
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching attendance", error: error.message });
    }
};

attendanceController.updateAttendance = async (req, res) => {
    try {
        const { status, date } = req.body;

        const { employeeId: employeeIdQuery, biometricId } = req.query;
        if (!date) {
            return res.status(400).json({ message: "date is required" });
        }

        if (!status) {
            return res.status(400).json({ message: "status is required" });
        }

        const allowedStatuses = ['Present', 'Absent', 'Half Day', 'Late'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Check 1-week time restriction
        if (!canModifyAttendance(date)) {
            return res.status(400).json({ 
                message: "Attendance cannot be modified after 1 week from the attendance date" 
            });
        }

        // Resolve employee by biometricId or employeeId
        let employee = null;
        if (biometricId) {
            employee = await All_Models.Employee.findOne({ where: { biometricId } });
        } else if (employeeIdQuery) {
            employee = await All_Models.Employee.findByPk(employeeIdQuery);
        }
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const [updatedRowsCount] = await All_Models.Attendance.update(
            {
                status,
                lastModifiedBy: req.user?.id || null
            },
            { where: { employeeId: employee.id, date } }
        );
        
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        
        const updatedAttendance = await All_Models.Attendance.findOne({ 
            where: { employeeId: employee.id, date },
            include: [{
                model: All_Models.Employee,
                attributes: ['name', 'email', 'department', 'designation', 'biometricId']
            }]
        });
        res.status(200).json(updatedAttendance);
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error: error.message });
    }
};

// New function: Mark attendance
attendanceController.markAttendance = async (req, res) => {
    try {
        const {
            employeeId: employeeIdBody,
            biometricId: biometricIdBody,
            name,
            status,
            punchIn,
            punchOut,
            date,
            remarks
        } = req.body;

        if (!name || !status || !date) {
            return res.status(400).json({ 
                message: "name, status, and date are required" 
            });
        }

        // Resolve employee by biometricId or employeeId
        let employee = null;
        if (biometricIdBody) {
            employee = await All_Models.Employee.findOne({ where: { biometricId: biometricIdBody } });
        } else if (employeeIdBody) {
            employee = await All_Models.Employee.findByPk(employeeIdBody);
        }
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Calculate working hours if punch times are provided
        const workingHours = calculateWorkingHours(punchIn, punchOut);

        // Check if attendance already exists for this employee and date
        const existingAttendance = await All_Models.Attendance.findOne({
            where: { employeeId: employee.id, date }
        });

        if (existingAttendance) {
            return res.status(400).json({ 
                message: "Attendance already exists for this employee on this date. Use update instead." 
            });
        }

        const attendance = await All_Models.Attendance.create({
            employeeId: employee.id,
            biometricId: employee.biometricId,
            name,
            status,
            punchIn,
            punchOut,
            workingHours,
            date,
            remarks,
            lastModifiedBy: req.user?.id || null
        });

        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: "Error marking attendance", error: error.message });
    }
};

// New function: Get employee attendance with date range
attendanceController.getEmployeeAttendance = async (req, res) => {
    try {
        const { employeeId, startDate, endDate } = req.query;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required" });
        }

        // Validate employee exists
        const employee = await All_Models.Employee.findByPk(employeeId);
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        let whereClause = { employeeId };
        
        if (startDate && endDate) {
            whereClause.date = {
                [All_Models.Sequelize.Op.between]: [startDate, endDate]
            };
        } else if (startDate) {
            whereClause.date = {
                [All_Models.Sequelize.Op.gte]: startDate
            };
        } else if (endDate) {
            whereClause.date = {
                [All_Models.Sequelize.Op.lte]: endDate
            };
        }

        const attendances = await All_Models.Attendance.findAll({
            where: whereClause,
            include: [{
                model: All_Models.Employee,
                attributes: ['name', 'email', 'department', 'designation', 'biometricId']
            }],
            order: [['date', 'DESC']]
        });

        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employee attendance", error: error.message });
    }
};

// New function: Get daily attendance for all employees
attendanceController.getDailyAttendance = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "date is required" });
        }

        const attendances = await All_Models.Attendance.findAll({
            where: { date },
            include: [{
                model: All_Models.Employee,
                attributes: ['name', 'email', 'department', 'designation', 'company', 'biometricId']
            }],
            order: [['employeeId', 'ASC']]
        });

        res.status(200).json(attendances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching daily attendance", error: error.message });
    }
};

// New function: Upload attendance sheet from CSV
attendanceController.uploadAttendanceSheet = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const csvData = await csvParser(filePath);

        const results = {
            success: [],
            errors: [],
            total: csvData.length
        };

        for (const row of csvData) {
            try {
                const {
                    employeeId: employeeIdCsv,
                    biometricId: biometricIdCsv,
                    name,
                    status,
                    punchIn,
                    punchOut,
                    remarks
                } = row;

                if ((!employeeIdCsv && !biometricIdCsv) || !name || !status) {
                    results.errors.push({
                        row,
                        error: "Missing required fields: biometricId/employeeId, name, status"
                    });
                    continue;
                }

                // Validate employee exists
                let employee = null;
                if (biometricIdCsv) {
                    employee = await All_Models.Employee.findOne({ where: { biometricId: biometricIdCsv } });
                } else if (employeeIdCsv) {
                    employee = await All_Models.Employee.findByPk(employeeIdCsv);
                }
                if (!employee) {
                    results.errors.push({
                        row,
                        error: `Employee not found for provided biometricId/employeeId`
                    });
                    continue;
                }

                // Calculate working hours
                const workingHours = calculateWorkingHours(punchIn, punchOut);

                // Check if attendance already exists
                const existingAttendance = await All_Models.Attendance.findOne({
                    where: { employeeId: employee.id, date: row.date || new Date().toISOString().split('T')[0] }
                });

                if (existingAttendance) {
                    // Update existing attendance
                    await All_Models.Attendance.update({
                        name,
                        status,
                        punchIn,
                        punchOut,
                        workingHours,
                        biometricId: employee.biometricId,
                        remarks,
                        lastModifiedBy: req.user?.id || null,
                        modificationReason: "Bulk upload update"
                    }, {
                        where: { employeeId: employee.id, date: row.date || new Date().toISOString().split('T')[0] }
                    });
                    results.success.push({ employeeId: employee.id, action: "updated" });
                } else {
                    // Create new attendance
                    await All_Models.Attendance.create({
                        employeeId: employee.id,
                        biometricId: employee.biometricId,
                        name,
                        status,
                        punchIn,
                        punchOut,
                        workingHours,
                        date: row.date || new Date().toISOString().split('T')[0],
                        remarks,
                        lastModifiedBy: req.user?.id || null
                    });
                    results.success.push({ employeeId: employee.id, action: "created" });
                }
            } catch (error) {
                results.errors.push({
                    row,
                    error: error.message
                });
            }
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: "Error uploading attendance sheet", error: error.message });
    }
};

// New function: Preview attendance sheet
attendanceController.previewAttendanceSheet = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = req.file.path;
        const csvData = await csvParser(filePath);

        // Validate and preview first 10 rows
        const preview = [];
        const errors = [];

        for (let i = 0; i < Math.min(10, csvData.length); i++) {
            const row = csvData[i];
            const rowPreview = {
                rowNumber: i + 1,
                data: row,
                isValid: true,
                issues: []
            };

            // Basic validation
            if (!row.employeeId) rowPreview.issues.push("Missing employeeId");
            if (!row.name) rowPreview.issues.push("Missing name");
            if (!row.status) rowPreview.issues.push("Missing status");
            if (row.status && !['Present', 'Absent', 'Half Day', 'Late'].includes(row.status)) {
                rowPreview.issues.push("Invalid status");
            }

            if (rowPreview.issues.length > 0) {
                rowPreview.isValid = false;
                errors.push(rowPreview);
            } else {
                preview.push(rowPreview);
            }
        }

        res.status(200).json({
            totalRows: csvData.length,
            previewRows: preview.length,
            preview,
            errors,
            sampleData: csvData.slice(0, 3)
        });
    } catch (error) {
        res.status(500).json({ message: "Error previewing attendance sheet", error: error.message });
    }
};

// New function: Check if attendance can be modified
attendanceController.canModifyAttendance = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: "date is required" });
        }

        const canModify = canModifyAttendance(date);
        
        res.status(200).json({
            canModify,
            date,
            reason: canModify ? "Within modification window" : "Outside 1-week modification window"
        });
    } catch (error) {
        res.status(500).json({ message: "Error checking modification status", error: error.message });
    }
};

export default attendanceController;