import https from "https";
import * as os from "os";
import * as fs from "fs";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const LTS_URL_PREFIX = 'https://nodejs.org/dist/latest-v20.x/';

/**
 Fetches the latest Node.js version by making a request to a specified URL.
 @returns {Promise<string>} A promise that resolves with the latest Node.js version string on success,
  or rejects with an error if the latest version cannot be found.
 */
async function fetchLatestNodeVersion() {
    return new Promise((resolve, reject) => {
        https.get(LTS_URL_PREFIX, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {

                const versionMatch = /node-v(\d+\.\d+\.\d+)/.exec(data);
                if (versionMatch) {
                    resolve(versionMatch[1]);
                } else {
                    reject(new Error('Could not find latest Node.js version'));
                }
            });
        }).on('error', reject);
    });
}

/**
 * Downloads a Node.js binary file from a specified version, platform, and architecture.
 * @param {string} version - The version of Node.js to download (e.g., "14.17.0").
 * @param {string} platform - The platform for which to download the binary (e.g., "win","linux","darwin").
 * @param {string} arch - The architecture for which to download the binary (e.g., "x64","arm64").
 * @returns {Promise<string>} - A Promise that resolves to the downloaded file name if successful.
 * @throws {Error} - If the file fails to download after the maximum number of retries.
 */

async function downloadNodeBinary(version, platform, arch) {
    const extension = (platform === "win") ? "zip" : "tar.gz";
    const fileName = `node-v${version}-${platform}-${arch}.${extension}`;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const fullPath = `${__dirname}/${fileName}`
    // Check if the file already exists
    if (fs.existsSync(fullPath)) {
        console.log(`File ${fileName} already exists. No need to download.`);
        return fileName;
    }
    const MAX_RETRIES = 3
    console.log(`downloading node ${version} for ${platform} ${arch}`);
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            const file = fs.createWriteStream(fullPath);
            await new Promise((resolve, reject) => {
                const downloadUrl = `${LTS_URL_PREFIX}node-v${version}-${platform}-${arch}.${extension}`;
                console.log(downloadUrl);
                https.get(downloadUrl, (res) => {
                    res.pipe(file);
                    res.on('end', () => resolve(fileName));
                    res.on('error', (err) => {
                        fs.unlinkSync(fileName); // Remove the file on error
                        reject(err);
                    });
                });
            });
            return fileName; // If the download was successful, return the file name
        } catch (err) {
            console.error(`Download attempt ${attempt + 1} failed.`);
            if (attempt < MAX_RETRIES - 1) {
                console.log(`Retrying download...`);
            }
        }
    }
    throw new Error(`Failed to download file after ${MAX_RETRIES} attempts.`);
}

/**
 * Retrieves platform details including the operating system platform and architecture.
 * @returns {Object} An object containing the platform and architecture details.
 * @example
 * const platformDetails = getPlatformDetails();
 * console.log(platformDetails.platform); // "win" or the actual platform value
 * console.log(platformDetails.arch); // the architecture value
 */
export function getPlatformDetails() {
    const platform = os.platform();
    const arch = os.arch();
    return {
        platform: (platform === "win32") ? "win" : platform,
        arch: arch
    }
}

let args = process.argv.slice(2);

const folderName="temp";
fs.mkdirSync(folderName);
const platformDetails = (args.length === 1) ? JSON.parse(args[0]) : getPlatformDetails();
const version = await fetchLatestNodeVersion();
const fileName = await downloadNodeBinary(version, platformDetails.platform, platformDetails.arch);
fs.copyFileSync(fileName,folderName);
console.log(fileName);