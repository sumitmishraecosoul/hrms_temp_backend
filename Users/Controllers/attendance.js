import All_Models from "../../Utils/All_Models.js";

const attendanceController = {}

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
        const { attendanceId } = req.query;

        const attendance = await All_Models.Attendance.findOne({ where: { attendanceId } });
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
        const {
            status,
            punchIn,
            punchOut,
            date
        } = req.body;

        const { attendanceId } = req.query;
        if (!attendanceId) {
            return res.status(400).json({ message: "attendanceId does not exist" });
        }
        
        const [updatedRowsCount] = await All_Models.Attendance.update(
            {
                status,
                punchIn,
                punchOut,
                date
            },
            { where: { attendanceId } }
        );
        
        if (updatedRowsCount === 0) {
            return res.status(404).json({ message: "Attendance not found" });
        }
        
        const updatedAttendance = await All_Models.Attendance.findOne({ where: { attendanceId } });
        res.status(200).json(updatedAttendance);
    } catch (error) {
        res.status(500).json({ message: "Error updating attendance", error: error.message });
    }
};


export default attendanceController;