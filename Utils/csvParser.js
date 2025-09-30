import fs from "fs";
import path from "path";
import { parse as parseCsv } from "csv-parse/sync";

const csvParser = async (filePath) => {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const ext = path.extname(filePath).toLowerCase();

            if (ext === ".csv") {
                const text = fileBuffer.toString("utf8");
                const records = parseCsv(text, { columns: true, skip_empty_lines: true });
                return records;
            }

            throw new Error(`Unsupported file format: ${ext}. Only CSV files are supported.`);
        } catch (error) {
            throw new Error(`Error parsing CSV file: ${error.message}`);
        }
}

export default csvParser;