const { error } = require('console');
const fs = require('fs');
const CONSTANTS = require("./constants.js");

getSettings = () => {

    const settingsFile = process.env.SETTINGS_FILE

    if (!fs.existsSync(settingsFile)) {
        throw new error('file provided does not exists')
    }

    const rawData = fs.readFileSync(settingsFile)
    const jsonData = JSON.parse(rawData)

    return {
        skipGitCommit: process.env.SKIP_GIT_COMMIT || false,
        versionPrefix: process.env.VERSION_PREFIX || "",
        conventionalCommits: jsonData?.conventionalCommits || CONSTANTS.DEFAULT_CONVENTIONAL_COMMITS,
        scopes: jsonData?.scopes || {}
    }
}

module.exports = {
    getSettings
};
