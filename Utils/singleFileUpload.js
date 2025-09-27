import { createDirectory } from "./directoryFunctions";

export const singleFileUpload = async (req, res) => {
    return new Promise((resolve, reject) => {
        createDirectory(path);

        file.mv(path, (err) => {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
}