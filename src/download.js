import { downloadNodeBinary, fetchLatestNodeVersion } from "./nodeDownloader.js";
import platforms from "./platforms.json" assert { type: 'json' };

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

