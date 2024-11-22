import { fetchLatestNodeVersion } from "./nodeDownloader.js";

(async () => {
    try {
        const latestVersion = await fetchLatestNodeVersion();
        console.log(latestVersion);
    } catch (error) {
        console.error('Error fetching the latest Node.js version:', error.message);
    } finally {
        process.exit(0); // Ensure the process exits after execution
    }
})();

