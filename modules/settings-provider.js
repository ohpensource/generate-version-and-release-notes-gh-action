const fs = require('fs');
const fileTools = require('./file-tools.js')

const DEFAULT_CONVENTIONAL_COMMITS = {
    "break": {
        "release": "major"
    },
    "feat": {
        "release": "minor"
    },
    "fix": {
        "release": "patch"
    },
    "build": {
        "release": "none"
    },
    "chore": {
        "release": "none"
    },
    "ci": {
        "release": "none"
    },
    "docs": {
        "release": "none"
    },
    "style": {
        "release": "none"
    },
    "refactor": {
        "release": "none"
    },
    "perf": {
        "release": "none"
    },
    "test": {
        "release": "none"
    }
}

getSettings = (settingsFile) => {

    let result = {
        conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS,
        scopes: {},
        scopesDiscovery: false
    }

    if (settingsFile && !fs.existsSync(settingsFile)) {
        throw new Error('file provided does not exists')
    }

    if (settingsFile && fs.existsSync(settingsFile)) {
        const jsonData = fileTools.getJsonFrom(settingsFile)
        result.conventionalCommits = jsonData?.conventionalCommits ?? DEFAULT_CONVENTIONAL_COMMITS
        result.scopes = jsonData?.scopes ?? {}
        result.scopesDiscovery = jsonData?.scopesDiscovery ?? false
    }

    return result
}

module.exports = {
    getSettings
};
