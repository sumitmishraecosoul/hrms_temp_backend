// import AttendanceSheet from "../../Models/attendanceSheet.js";
// import { parse as parseCsv } from "csv-parse/sync";

// const attendanceSheetController = {}

// attendanceSheetController.uploadAttendanceSheet = async (req, res) => {
//     try {

//         const { percentage, date } = req.body;

//         if (!req.files || !req.files.attendanceSheet) {
//             return res.status(400).json({ message: "No file uploaded" });
//         }

//         const file = req.files.attendanceSheet;
//         const fileBuffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);

//         const attendanceSheetDoc = new AttendanceSheet({
//             date: date ? new Date(date) : new Date(),
//             timeUploaded: new Date(),
//             percentage: percentage || "",
//             attendanceSheet: fileBuffer,
//         });

//         await attendanceSheetDoc.save();

//         return res.status(200).json({ message: "Attendance sheet uploaded successfully", attendanceSheetId: attendanceSheetDoc.attendanceSheetId || attendanceSheetDoc._id });
//     } catch (error) {
//         console.error("Error uploading attendance sheet:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// attendanceSheetController.getAllAttendanceSheets = async (req, res) => {
//     try {
//         const attendanceSheets = await AttendanceSheet.find({});
//         return res.status(200).json(attendanceSheets);
//     } catch (error) {
//         console.error("Error fetching attendance sheets:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// attendanceSheetController.getAttendanceSheetById = async (req, res) => {
//     try {
//         const { attendanceSheetId } = req.query;
//         const attendanceSheet = await AttendanceSheet.findOne({ attendanceSheetId });
//         return res.status(200).json(attendanceSheet);
//     } catch (error) {
//         console.error("Error fetching attendance sheet:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// attendanceSheetController.deleteAttendanceSheet = async (req, res) => {
//     try {
//         const { attendanceSheetId } = req.query;
//         const attendanceSheet = await AttendanceSheet.findOneAndDelete({ attendanceSheetId });
//         return res.status(200).json({ message: "Attendance sheet deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting attendance sheet:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


// attendanceSheetController.updateAttendanceSheet = async (req, res) => {
//     try {
//         const { attendanceSheetId } = req.query;
//         const { percentage, date } = req.body;

//         if (!attendanceSheetId) {
//             return res.status(400).json({ message: "attendanceSheetId is required" });
//         }

//         const updatePayload = {};

//         if (req.files && req.files.attendanceSheet) {
//             const file = req.files.attendanceSheet;
//             const fileBuffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
//             updatePayload.attendanceSheet = fileBuffer;
//             updatePayload.timeUploaded = new Date();
//             updatePayload.date = date ? new Date(date) : new Date();
//         } else if (date) {
//             updatePayload.date = new Date(date);
//         }

//         const updatedAttendanceSheet = await AttendanceSheet.findOneAndUpdate(
//             { attendanceSheetId },
//             { ...updatePayload, ...(percentage !== undefined ? { percentage } : {}) },
//             { new: true }
//         );

//         return res.status(200).json(updatedAttendanceSheet);
//     } catch (error) {
//         console.error("Error updating attendance sheet:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// attendanceSheetController.previewAttendanceSheet = async (req, res) => {
//     try {
//         const { attendanceSheetId } = req.query;
//         if (!attendanceSheetId) {
//             return res.status(400).json({ message: "attendanceSheetId is required" });
//         }

//         let sheet = await AttendanceSheet.findOne({ attendanceSheetId });
//         if (!sheet) {
//             try {
//                 sheet = await AttendanceSheet.findById(attendanceSheetId);
//             } catch (_) {
//             }
//         }
//         if (!sheet || !sheet.attendanceSheet) {
//             return res.status(404).json({ message: "Attendance sheet not found" });
//         }

//         let mappedRows = [];
//         try {
//             const text = sheet.attendanceSheet.toString('utf8');
//             mappedRows = parseCsv(text, { columns: true, skip_empty_lines: true });
//         } catch (err) {
//             return res.status(415).json({ message: "Unsupported file format for preview" });
//         }

//         return res.status(200).json({ mapped: mappedRows });
//     } catch (error) {
//         console.error("Error previewing attendance sheet:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// export default attendanceSheetController;
