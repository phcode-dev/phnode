import https from "https";
import * as os from "os";
import * as fs from "fs";
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import { URL } from 'url';

const LTS_URL_PREFIX = 'https://nodejs.org/dist/latest-v20.x/';

/**
 * Fetches the latest Node.js version by making a request to a specified URL.
 * @returns {Promise<string>} A promise that resolves with the latest Node.js version string on success,
 * or rejects with an error if the latest version cannot be found.
 */
export async function fetchLatestNodeVersion() {
    return new Promise((resolve, reject) => {
        const fetch = (url) => {
            https.get(url, (res) => {
                if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                    const redirectUrl = new URL(res.headers.location, url).href;
                    fetch(redirectUrl);
                    return;
                }

                if (res.statusCode !== 200) {
                    reject(new Error(`Request failed with status code: ${res.statusCode}`));
                    return;
                }

                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const versionMatch = /node-v(\d+\.\d+\.\d+)/.exec(data);
                        if (versionMatch) {
                            resolve(versionMatch[1]);
                        } else {
                            reject(new Error('Could not find the latest Node.js version in the data.'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', reject);
        };

        fetch(LTS_URL_PREFIX);
    });
}


function getAssetsFolder() {
    const fullyQualifiedFileName = fileURLToPath(import.meta.url);
    const assets = `${dirname(fullyQualifiedFileName)}/assets`;
    fs.mkdirSync(assets, {recursive: true});
    return assets;

}

/**
 * Downloads a Node.js binary file from a specified version, platform, and architecture.
 * @param {string} version - The version of Node.js to download (e.g., "14.17.0").
 * @param {string} platform - The platform for which to download the binary (e.g., "win","linux","darwin").
 * @param {string} arch - The architecture for which to download the binary (e.g., "x64","arm64").
 * @returns {Promise<string>} - A Promise that resolves to the downloaded file name if successful.
 * @throws {Error} - If the file fails to download after the maximum number of retries.
 */

export async function downloadNodeBinary(version, platform, arch) {
    const extension = platform === 'win' ? 'zip' : 'tar.gz';
    const fileName = `node-v${version}-${platform}-${arch}.${extension}`;
    const assets = getAssetsFolder();
    const fullPath = `${assets}/${fileName}`;

    // Check if the file already exists
    if (fs.existsSync(fullPath)) {
        console.log(`File ${fileName} already exists. No need to download.`);
        return fileName;
    }

    const MAX_RETRIES = 3;
    console.log(`Downloading Node.js ${version} for ${platform} ${arch}`);

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            await new Promise((resolve, reject) => {
                const downloadUrl = `${LTS_URL_PREFIX}node-v${version}-${platform}-${arch}.${extension}`;
                const fetch = (url) => {
                    https.get(url, (res) => {
                        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                            const redirectUrl = new URL(res.headers.location, url).href;
                            console.log(`Redirecting to: ${redirectUrl}`);
                            fetch(redirectUrl); // Follow the redirect
                            return;
                        }

                        if (res.statusCode !== 200) {
                            reject(new Error(`Request failed with status code: ${res.statusCode}`));
                            return;
                        }

                        const file = fs.createWriteStream(fullPath);

                        res.pipe(file);
                        res.on('end', () => resolve(fileName));
                        res.on('error', (err) => {
                            fs.unlinkSync(fullPath); // Remove the file on error
                            reject(err);
                        });
                    }).on('error', reject);
                };

                fetch(downloadUrl);
            });

            return fileName; // If the download was successful, return the file name
        } catch (err) {
            console.error(`Download attempt ${attempt + 1} failed: ${err.message}`);
            if (attempt < MAX_RETRIES - 1) {
                console.log('Retrying download...');
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

