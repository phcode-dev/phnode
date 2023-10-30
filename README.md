# PHNode Project

Welcome to the PHNode Project repository. This project is designed to facilitate reliable and consistent access to the latest Long Term Support (LTS) version of Node.js across various platforms. By caching Node.js versions directly in this repository, we aim to mitigate potential workflow disruptions caused by direct downloads from nodejs.org.

## Overview

 This repository:

    Pulls the latest LTS version of Node.js from nodejs.org for different operating systems and architectures.
    Caches these Node.js binaries to provide faster and more reliable access.
    Automatically updates the cache with each minor version release within the current LTS line.

## Why PHNode?

Downloading Node.js directly from the official nodejs.org server during automated workflows and deployments can sometimes lead to issues such as network instability, server downtime, or rate limiting. By caching the Node.js binaries in this repository, we aim to provide a more robust solution that ensures your workflows remain uninterrupted.
How to Use

To make use of the cached Node.js binaries in your projects, follow the instructions below:

    Find the Required Version: Navigate through the repository to find the specific version of Node.js that you need for your platform.

    Download: Click on the relevant file and use the Download button to obtain the binary.

    Integrate: Integrate the downloaded Node.js binary into your project or workflow as you would normally.

## Automatic Updates

The PHNode repository is configured to automatically fetch and update the cache whenever a new minor version of the current LTS line of Node.js is released. This ensures that you always have access to the most up-to-date and stable version for your development and production needs.
Contributing

If you would like to contribute to the PHNode project or report issues, please feel free to open a pull request or submit an issue through the GitHub repository.
License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). For more information, please see the LICENSE file in this repository.
