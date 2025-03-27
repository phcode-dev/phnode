import { downloadNodeBinary, fetchLatestNodeVersion } from "./nodeDownloader.js";
import fs from 'fs';
// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use an absolute path to the platforms.json file
const platforms = JSON.parse(fs.readFileSync(path.join(__dirname, 'platforms.json'), 'utf-8'));

(async () => {
    try {
        const supportedPlatforms = platforms.configurations;
        const version = await fetchLatestNodeVersion();

        for (const platform of supportedPlatforms) {
            const fileName = await downloadNodeBinary(version, platform.platform, platform.arch);
            console.log(fileName);
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        process.exit(0); // Ensure the process exits properly
    }
})();

