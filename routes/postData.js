import fs from 'fs';

const dataFileBasePath = process.env.DATA_FILE_BASEPATH;
const dataFilePath = `${dataFileBasePath}post.json`;

const fileData = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFilePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const jsonData = async () => {
    return JSON.parse(await fileData());
}

export { jsonData }
