import {downloadNodeBinary, fetchLatestNodeVersion} from "./nodeDownloader.js";
import platforms from "./platforms.json" assert {type: 'json'};

const supportedPlatforms = platforms.configurations;
const version = await fetchLatestNodeVersion();
for (const platform of supportedPlatforms) {
    const fileName = await downloadNodeBinary(version, platform.platform, platform.arch);
    console.log(fileName);
}
